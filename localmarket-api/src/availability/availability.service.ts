import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilitySlotDto } from './dto/upsert-availability.dto';

const DEFAULT_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  private async getProfile(userId: string) {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Provider profile not found');
    return profile;
  }

  async getMySlots(userId: string) {
    const profile = await this.getProfile(userId);

    const existing = await this.prisma.availabilitySlot.findMany({
      where: { providerId: profile.id },
    });

    // fill in defaults for any day not yet configured
    const slots = DEFAULT_DAYS.map((day) => {
      const found = existing.find((s) => s.day === day);
      return found || {
        day,
        startTime: '09:00',
        endTime: '18:00',
        isAvailable: day !== 'sunday',
      };
    });

    return {
      slots,
      preferences: {
        acceptingBookings: profile.acceptingBookings,
        advanceBookingDays: profile.advanceBookingDays,
        bufferTimeMins: profile.bufferTimeMins,
      },
    };
  }

  async updateSlots(userId: string, slots: AvailabilitySlotDto[]) {
    const profile = await this.getProfile(userId);

    await Promise.all(
      slots.map((slot) =>
        this.prisma.availabilitySlot.upsert({
          where: { providerId_day: { providerId: profile.id, day: slot.day } },
          update: { startTime: slot.startTime, endTime: slot.endTime, isAvailable: slot.isAvailable },
          create: { providerId: profile.id, ...slot },
        }),
      ),
    );

    return this.getMySlots(userId);
  }

  async updatePreferences(userId: string, dto: { acceptingBookings?: boolean; advanceBookingDays?: number; bufferTimeMins?: number }) {
    const profile = await this.getProfile(userId);
    return this.prisma.providerProfile.update({
      where: { id: profile.id },
      data: dto,
    });
  }
}