import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async getStats(month?: string) {
  const dateFilter = this.buildDateFilter(month);

  const [totalUsers, totalProviders, totalBookings, revenue, bookingsOverview, popularServices, recentBookings] =
    await Promise.all([
      this.prisma.user.count(),
      this.prisma.providerProfile.count(),
      this.prisma.booking.count({ where: dateFilter }),
      this.prisma.payment.aggregate({
        where: { status: 'succeeded', ...(month ? { createdAt: dateFilter.createdAt } : {}) },
        _sum: { amount: true },
      }),
      this.getMonthlyBookingsOverview(),
      this.getPopularServices(dateFilter),
      this.prisma.booking.findMany({
        where: dateFilter,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { name: true, avatarUrl: true } },
          provider: { include: { user: { select: { name: true } } } },
          service: true,
        },
      }),
    ]);

  return {
    totalUsers,
    totalProviders,
    totalBookings,
    totalRevenue: revenue._sum.amount || 0,
    bookingsOverview,
    popularServices,
    recentBookings,
  };
}

private buildDateFilter(month?: string): { createdAt?: { gte: Date; lt: Date } } {
  if (!month) return {};
  const [year, m] = month.split('-').map(Number);
  const start = new Date(year, m - 1, 1);
  const end = new Date(year, m, 1);
  return { createdAt: { gte: start, lt: end } };
}

private async getMonthlyBookingsOverview() {
  const bookings = await this.prisma.booking.findMany({
    select: { createdAt: true, status: true },
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const grouped: Record<string, { bookings: number; completed: number }> = {};

  bookings.forEach((b) => {
    const month = months[new Date(b.createdAt).getMonth()];
    if (!grouped[month]) grouped[month] = { bookings: 0, completed: 0 };
    grouped[month].bookings += 1;
    if (b.status === 'completed') grouped[month].completed += 1;
  });

  return months.filter((m) => grouped[m]).map((m) => ({ month: m, ...grouped[m] }));
}

private async getPopularServices(dateFilter: { createdAt?: { gte: Date; lt: Date } }) {
  const bookings = await this.prisma.booking.findMany({
    where: dateFilter,
    include: { service: { include: { category: true } } },
  });

  const counts: Record<string, number> = {};
  bookings.forEach((b) => {
    const name = b.service.category.name;
    counts[name] = (counts[name] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

async exportBookingsCsv(month?: string) {
  const dateFilter = this.buildDateFilter(month);

  const bookings = await this.prisma.booking.findMany({
    where: dateFilter,
    include: {
      customer: { select: { name: true, email: true } },
      provider: { include: { user: { select: { name: true } } } },
      service: { select: { title: true } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const header =
    'Booking ID,Customer,Customer Email,Provider,Service,Date,Time,Amount,Status,Payment Method,Payment Status\n';

  const rows = bookings.map((b) =>
    [
      b.id,
      b.customer.name,
      b.customer.email,
      b.provider.user.name,
      b.service.title,
      new Date(b.date).toLocaleDateString(),
      b.time,
      b.amount,
      b.status,
      b.paymentMethod || '',
      b.payment?.status || '',
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(','),
  );

  return header + rows.join('\n');
}

  async getUsers(role?: string) {
    return this.prisma.user.findMany({
      where: role ? { role: role as any } : undefined,
      select: {
        id: true, name: true, email: true, role: true, city: true, avatarUrl: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProviders() {
    return this.prisma.providerProfile.findMany({
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyProvider(id: string, verified: boolean) {
    return this.prisma.providerProfile.update({
      where: { id },
      data: { verified },
    });
  }

  async getBookings() {
    return this.prisma.booking.findMany({
      include: {
        customer: { select: { name: true, avatarUrl: true } },
        provider: { include: { user: { select: { name: true, avatarUrl: true } } } },
        service: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
  async getPayments() {
  return this.prisma.payment.findMany({
    include: {
      booking: {
        include: {
          customer: { select: { name: true, avatarUrl: true } },
          provider: { include: { user: { select: { name: true, avatarUrl: true } } } },
          service: { select: { title: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

async getAllReviews() {
  return this.prisma.review.findMany({
    include: {
      customer: { select: { name: true, avatarUrl: true } },
      provider: { include: { user: { select: { name: true, avatarUrl: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

async deleteReview(id: string) {
  return this.prisma.review.delete({ where: { id } });
}

async getCategoriesWithStats() {
  const categories = await this.prisma.category.findMany({
    include: { _count: { select: { providers: true } } },
    orderBy: { name: 'asc' },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: c.icon,
    providerCount: c._count.providers,
  }));
}

async createCategory(dto: { name: string; icon?: string }) {
  return this.prisma.category.create({ data: dto });
}

async updateCategory(id: string, dto: { name?: string; icon?: string }) {
  return this.prisma.category.update({ where: { id }, data: dto });
}

async deleteCategory(id: string) {
  return this.prisma.category.delete({ where: { id } });
}

async getReports() {
  const [totalBookings, totalRevenue, completedCount, cancelledCount, providersCount, bookingsOverTime] =
    await Promise.all([
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({ where: { status: 'succeeded' }, _sum: { amount: true } }),
      this.prisma.booking.count({ where: { status: 'completed' } }),
      this.prisma.booking.count({ where: { status: 'cancelled' } }),
      this.prisma.providerProfile.count(),
      this.getWeeklyBookings(),
    ]);

  return {
    totalBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    completedCount,
    cancelledCount,
    activeProviders: providersCount,
    bookingsOverTime,
  };
}

private async getWeeklyBookings() {
  const bookings = await this.prisma.booking.findMany({
    select: { createdAt: true, status: true },
    orderBy: { createdAt: 'asc' },
  });

  const buckets: Record<string, { completed: number; pending: number; cancelled: number }> = {};

  bookings.forEach((b) => {
    const key = new Date(b.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (!buckets[key]) buckets[key] = { completed: 0, pending: 0, cancelled: 0 };
    if (b.status === 'completed') buckets[key].completed += 1;
    if (b.status === 'pending') buckets[key].pending += 1;
    if (b.status === 'cancelled') buckets[key].cancelled += 1;
  });

  return Object.entries(buckets)
    .slice(-8)
    .map(([date, v]) => ({ date, ...v }));
}

async getSettings() {
  let settings = await this.prisma.settings.findFirst();

  // singleton pattern — create default row if none exists yet
  if (!settings) {
    settings = await this.prisma.settings.create({ data: {} });
  }

  return settings;
}

async updateSettings(dto: {
  platformName?: string;
  supportEmail?: string;
  contactNumber?: string;
  timezone?: string;
  currency?: string;
}) {
  const existing = await this.getSettings(); // ensures a row exists

  return this.prisma.settings.update({
    where: { id: existing.id },
    data: dto,
  });
}
async getProviderApplications(status?: string) {
    return this.prisma.providerProfile.findMany({
      where: status && status !== 'all' ? { status: status as any } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, city: true, createdAt: true, avatarUrl: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveProviderApplication(id: string) {
    const profile = await this.prisma.providerProfile.update({
      where: { id },
      data: { status: 'approved', verified: true },
    });

    await this.prisma.user.update({ where: { id: profile.userId }, data: { role: 'provider' } });

    await this.notificationsService.create(profile.userId, 'provider_approved', {
      message: 'Your provider account has been approved! You can now log in and access your provider dashboard.',
    });

    return profile;
  }

  async rejectProviderApplication(id: string) {
    const profile = await this.prisma.providerProfile.update({
      where: { id },
      data: { status: 'rejected' },
    });

    await this.notificationsService.create(profile.userId, 'provider_rejected', {
      message: 'Your provider application was not approved at this time.',
    });

    return profile;
  }
}