import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProvider(providerId: string) {
    return this.prisma.review.findMany({
      where: { providerId },
      include: { customer: { select: { name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(customerId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });

    if (!booking) throw new BadRequestException('Booking not found');
    if (booking.customerId !== customerId) throw new BadRequestException('Not your booking');
    if (booking.status !== 'completed') {
      throw new BadRequestException('Can only review completed bookings');
    }

    const existing = await this.prisma.review.findUnique({ where: { bookingId: dto.bookingId } });
    if (existing) throw new ConflictException('Booking already reviewed');

    const review = await this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        customerId,
        providerId: booking.providerId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    // recalc provider rating + reviewCount
    const agg = await this.prisma.review.aggregate({
      where: { providerId: booking.providerId },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.providerProfile.update({
      where: { id: booking.providerId },
      data: {
        rating: agg._avg.rating || 0,
        reviewCount: agg._count,
      },
    });

    return review;
  }

  async findByCustomer(customerId: string) {
  return this.prisma.review.findMany({
    where: { customerId },
    include: { provider: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
}
}