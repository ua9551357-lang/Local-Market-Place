import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(customerId: string, dto: CreateBookingDto) {
  const booking = await this.prisma.booking.create({
    data: {
      customerId,
      providerId: dto.providerId,
      serviceId: dto.serviceId,
      date: new Date(dto.date),
      time: dto.time,
      address: dto.address,
      issueDesc: dto.issueDesc,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      status: 'pending',
    },
    include: {
      provider: { include: { user: { select: { name: true } } } },
      service: true,
    },
  });

  // notify provider
  await this.notificationsService.create(booking.provider.userId, 'new_booking', {
    bookingId: booking.id,
    customerName: 'A customer',
    serviceTitle: booking.service.title,
  });

  return booking;
}

  async updateStatusByProvider(userId: string, bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Provider profile not found');

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.providerId !== profile.id) {
      throw new ForbiddenException('Not your booking');
    }

    const updated = await this.prisma.booking.update({ where: { id: bookingId }, data: { status } });

    await this.notificationsService.create(booking.customerId, 'booking_status', {
      bookingId,
      status,
    });

    return updated;
  }

  async findMine(customerId: string) {
    return this.prisma.booking.findMany({
      where: { customerId },
      include: {
        provider: { include: { user: { select: { name: true } } } },
        service: true,
        payment: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        provider: { include: { user: { select: { name: true } } } },
        service: true,
        payment: true,
        customer: { select: { name: true, email: true } },
        review: true,
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // customer can only see own bookings; providers checked via providerId->userId later
    if (role === 'customer' && booking.customerId !== userId) {
      throw new ForbiddenException('Not your booking');
    }

    return booking;
  }

  async updateStatus(id: string, status: 'confirmed' | 'completed' | 'cancelled') {
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async findByProvider(userId: string) {
  const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) return [];

  return this.prisma.booking.findMany({
    where: { providerId: profile.id },
    include: {
      customer: { select: { name: true, phone: true } },
      service: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}
}