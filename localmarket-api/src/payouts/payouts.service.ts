import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayoutMethodDto } from './dto/create-payout-method.dto';

@Injectable()
export class PayoutsService {
  constructor(private prisma: PrismaService) {}

  private async getProfile(userId: string) {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Provider profile not found');
    return profile;
  }

  async getOverview(userId: string) {
    const profile = await this.getProfile(userId);

    const [totalEarnings, completedPayouts, pendingPayouts, methods, history] = await Promise.all([
      this.prisma.booking.aggregate({ where: { providerId: profile.id, status: 'completed' }, _sum: { amount: true } }),
      this.prisma.payout.aggregate({ where: { providerId: profile.id, status: 'completed' }, _sum: { amount: true } }),
      this.prisma.payout.aggregate({ where: { providerId: profile.id, status: 'pending' }, _sum: { amount: true } }),
      this.prisma.payoutMethod.findMany({ where: { providerId: profile.id }, orderBy: { isDefault: 'desc' } }),
      this.prisma.payout.findMany({
        where: { providerId: profile.id },
        include: { payoutMethod: true },
        orderBy: { requestedAt: 'desc' },
        take: 10,
      }),
    ]);

    const earned = Number(totalEarnings._sum.amount || 0);
    const paidOut = Number(completedPayouts._sum.amount || 0);
    const pending = Number(pendingPayouts._sum.amount || 0);
    const currentBalance = earned - paidOut - pending;

    return { currentBalance, methods, history };
  }

  async addMethod(userId: string, dto: CreatePayoutMethodDto) {
    const profile = await this.getProfile(userId);

    const existingCount = await this.prisma.payoutMethod.count({ where: { providerId: profile.id } });

    return this.prisma.payoutMethod.create({
      data: { providerId: profile.id, ...dto, isDefault: existingCount === 0 },
    });
  }

  async requestPayout(userId: string, amount: number, payoutMethodId: string) {
    const profile = await this.getProfile(userId);

    const method = await this.prisma.payoutMethod.findUnique({ where: { id: payoutMethodId } });
    if (!method || method.providerId !== profile.id) {
      throw new BadRequestException('Invalid payout method');
    }

    const overview = await this.getOverview(userId);
    if (amount > overview.currentBalance) {
      throw new BadRequestException('Requested amount exceeds available balance');
    }

    return this.prisma.payout.create({
      data: { providerId: profile.id, payoutMethodId, amount, status: 'pending' },
    });
  }
}