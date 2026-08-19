import { Injectable,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(customerId: string) {
    const [totalBookings, upcomingBookings, completedBookings, payments, recentBookings, recentMessages] =
      await Promise.all([
        this.prisma.booking.count({ where: { customerId } }),
        this.prisma.booking.count({
          where: { customerId, status: { in: ['pending', 'confirmed'] } },
        }),
        this.prisma.booking.count({ where: { customerId, status: 'completed' } }),
        this.prisma.payment.aggregate({
          where: { booking: { customerId } },
          _sum: { amount: true },
        }),
        this.prisma.booking.findMany({
          where: { customerId, status: { in: ['pending', 'confirmed'] } },
          include: { provider: { include: { user: { select: { name: true } } } }, service: true },
          orderBy: { date: 'asc' },
          take: 3,
        }),
        this.prisma.message.findMany({
          where: { senderId: customerId },
          orderBy: { createdAt: 'desc' },
          take: 3,
        }),
      ]);

    return {
      totalBookings,
      upcomingBookings,
      completedBookings,
      totalSpent: payments._sum.amount || 0,
      recentBookings,
      recentMessages,
    };
  }


  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, city: true, avatarUrl: true, notifyEmail: true, notifySms: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateMe(userId: string, dto: { name?: string; phone?: string; city?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, name: true, email: true, phone: true, city: true, avatarUrl: true },
    });
  }

  async updateNotifications(userId: string, dto: { notifyEmail?: boolean; notifySms?: boolean }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { notifyEmail: true, notifySms: true },
    });
  }
}