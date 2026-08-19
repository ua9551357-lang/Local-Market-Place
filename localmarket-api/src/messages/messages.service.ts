import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getThreadsForUser(userId: string, role: string) {
  if (role === 'provider') {
    const profile = await this.prisma.providerProfile.findUnique({ where: { userId } });
    if (!profile) return [];
    return this.prisma.thread.findMany({
      where: { providerId: profile.id },
      include: {
        customer: { select: { id: true, name: true, avatarUrl: true } },
        provider: { select: { userId: true, user: { select: { name: true, avatarUrl: true } } } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  return this.prisma.thread.findMany({
    where: { customerId: userId },
    include: {
      customer: { select: { id: true, name: true, avatarUrl: true } },
      provider: { select: { userId: true, user: { select: { name: true, avatarUrl: true } } } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { lastMessageAt: 'desc' },
  });
}

  async getOrCreateThread(customerId: string, providerId: string, bookingId?: string) {
    let thread = await this.prisma.thread.findFirst({
      where: { customerId, providerId },
    });

    if (!thread) {
      thread = await this.prisma.thread.create({
        data: { customerId, providerId, bookingId },
      });
    }

    return thread;
  }

  async getMessages(threadId: string) {
    return this.prisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(threadId: string, senderId: string, receiverId: string, body: string) {
    const thread = await this.prisma.thread.findUnique({ where: { id: threadId } });
    if (!thread) throw new NotFoundException('Thread not found');

    const message = await this.prisma.message.create({
      data: { threadId, senderId, receiverId, body },
    });

    await this.prisma.thread.update({
      where: { id: threadId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async markAsRead(threadId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: { threadId, receiverId: userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}