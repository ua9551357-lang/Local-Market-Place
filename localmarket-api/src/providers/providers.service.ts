import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { QueryProvidersDto } from './dto/query-providers.dto';
import { ApplyProviderDto } from './dto/apply-provider.dto';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ProvidersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(query: QueryProvidersDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProviderProfileWhereInput = {
      status: 'approved', // only approved providers show publicly
    };

    if (query.category) {
      where.category = { name: { equals: query.category, mode: 'insensitive' } };
    }
    if (query.minPrice || query.maxPrice) {
      where.priceFrom = {};
      if (query.minPrice) where.priceFrom.gte = Number(query.minPrice);
      if (query.maxPrice) where.priceFrom.lte = Number(query.maxPrice);
    }
    if (query.minRating) {
      where.rating = { gte: Number(query.minRating) };
    }
    if (query.city) {
      where.location = { contains: query.city, mode: 'insensitive' };
    }
    if (query.search) {
      where.OR = [
        { user: { name: { contains: query.search, mode: 'insensitive' } } },
        { bio: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.ProviderProfileOrderByWithRelationInput = { rating: 'desc' };
    if (query.sort === 'price_low') orderBy = { priceFrom: 'asc' };
    if (query.sort === 'price_high') orderBy = { priceFrom: 'desc' };
    if (query.sort === 'rating') orderBy = { rating: 'desc' };

    const [providers, total] = await Promise.all([
      this.prisma.providerProfile.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { user: { select: { name: true, avatarUrl: true } }, category: true },
      }),
      this.prisma.providerProfile.count({ where }),
    ]);

    return { data: providers, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, avatarUrl: true, city: true } },
        category: true,
        services: true,
      },
    });
    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }

  async applyAsProvider(userId: string, dto: ApplyProviderDto) {
    const existing = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (existing) throw new ConflictException('You have already applied as a provider');

    const profile = await this.prisma.providerProfile.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        bio: dto.bio,
        experienceYears: dto.experienceYears,
        priceFrom: dto.priceFrom,
        location: dto.location,
        status: 'pending',
      },
    });

    // Notify all admins about the new application
    const [admins, applicant] = await Promise.all([
      this.prisma.user.findMany({ where: { role: 'admin' } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    await Promise.all(
      admins.map((admin) =>
        this.notificationsService.create(admin.id, 'provider_application', {
          providerId: profile.id,
          applicantName: applicant?.name,
        }),
      ),
    );

    return profile;
  }

  async getMyProfile(userId: string) {
  const profile = await this.prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      services: true,
      category: true,
      user: { select: { name: true, email: true, phone: true, city: true, avatarUrl: true } },
    },
  });
  if (!profile) throw new NotFoundException('Provider profile not found');
  return profile;
}

  async createService(userId: string, dto: CreateServiceDto) {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Provider profile not found');

    return this.prisma.service.create({
      data: {
        providerId: profile.id,
        categoryId: dto.categoryId,
        title: dto.title,
        description: dto.description,
        price: dto.price,
        durationMins: dto.durationMins,
      },
    });
  }

  async deleteService(userId: string, serviceId: string) {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Provider profile not found');

    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || service.providerId !== profile.id) {
      throw new ForbiddenException('Not your service');
    }
    return this.prisma.service.delete({ where: { id: serviceId } });
  }

  async getEarnings(userId: string) {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Provider profile not found');

    const [totalEarnings, completedCount, pendingCount] = await Promise.all([
      this.prisma.booking.aggregate({ where: { providerId: profile.id, status: 'completed' }, _sum: { amount: true } }),
      this.prisma.booking.count({ where: { providerId: profile.id, status: 'completed' } }),
      this.prisma.booking.count({ where: { providerId: profile.id, status: 'pending' } }),
    ]);

    return { totalEarnings: totalEarnings._sum.amount || 0, completedCount, pendingCount };
  }

  async getEarningsChart(userId: string) {
  const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundException('Provider profile not found');

  const bookings = await this.prisma.booking.findMany({
    where: { providerId: profile.id, status: 'completed' },
    select: { amount: true, updatedAt: true },
    orderBy: { updatedAt: 'asc' },
  });

  const grouped: Record<string, number> = {};
  bookings.forEach((b) => {
    const key = new Date(b.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    grouped[key] = (grouped[key] || 0) + Number(b.amount);
  });

  const chart = Object.entries(grouped).slice(-8).map(([date, amount]) => ({ date, amount }));

  const [thisMonth, lastMonth, pending] = await Promise.all([
    this.prisma.booking.aggregate({
      where: { providerId: profile.id, status: 'completed', updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _sum: { amount: true },
    }),
    this.prisma.booking.aggregate({
      where: { providerId: profile.id, status: 'completed', updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      _sum: { amount: true },
    }),
    this.prisma.booking.aggregate({
      where: { providerId: profile.id, status: 'confirmed' },
      _sum: { amount: true },
    }),
  ]);

  return {
    chart,
    thisMonth: thisMonth._sum.amount || 0,
    lastMonth: lastMonth._sum.amount || 0,
    pending: pending._sum.amount || 0,
  };
}

async updateMyProfile(userId: string, dto: { bio?: string; experienceYears?: number; priceFrom?: number; location?: string; categoryId?: string }) {
  const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundException('Provider profile not found');

  return this.prisma.providerProfile.update({
    where: { id: profile.id },
    data: dto,
    include: { category: true, user: { select: { name: true, email: true, phone: true, city: true, avatarUrl: true } } },
  });
}

async updateNotificationPrefs(userId: string, dto: { notifyEmail?: boolean; notifySms?: boolean }) {
  const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) throw new NotFoundException('Provider profile not found');

  return this.prisma.providerProfile.update({ where: { id: profile.id }, data: dto });
}

async updateAvatar(userId: string, avatarUrl: string) {
  await this.prisma.user.update({ where: { id: userId }, data: { avatarUrl } });
  return { avatarUrl };
}

async toggleSave(userId: string, providerId: string) {
  const existing = await this.prisma.savedProvider.findUnique({
    where: { userId_providerId: { userId, providerId } },
  });

  if (existing) {
    await this.prisma.savedProvider.delete({ where: { id: existing.id } });
    return { saved: false };
  }

  await this.prisma.savedProvider.create({ data: { userId, providerId } });
  return { saved: true };
}

async getSavedProviders(userId: string) {
  const saved = await this.prisma.savedProvider.findMany({
    where: { userId },
    include: {
      provider: {
        include: {
          user: { select: { name: true, avatarUrl: true } },
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return saved.map((s) => ({ ...s.provider, savedAt: s.createdAt }));
}

async getSavedProviderIds(userId: string) {
  const saved = await this.prisma.savedProvider.findMany({
    where: { userId },
    select: { providerId: true },
  });
  return saved.map((s) => s.providerId);
}
}