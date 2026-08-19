import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createForBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.paymentMethod === 'cash') {
      const payment = await this.prisma.payment.create({
        data: {
          bookingId,
          amount: booking.amount,
          method: 'cash',
          status: 'pending', // becomes succeeded on service completion
        },
      });
      return { payment, clientSecret: null };
    }

    // online payment
    const intent = await this.stripeService.createPaymentIntent(Number(booking.amount));

    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount: booking.amount,
        method: 'online',
        status: 'pending',
        stripeIntentId: intent.id,
      },
    });

    return { payment, clientSecret: intent.client_secret };
  }
}