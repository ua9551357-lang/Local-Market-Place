import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findByProvider(providerId: string) {
    return this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'asc' },
    });
  }
}