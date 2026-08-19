import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SupportService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createTicket(userId: string, subject: string, message: string) {
    const ticket = await this.prisma.supportTicket.create({
      data: { userId, subject, message },
    });

    const admins = await this.prisma.user.findMany({ where: { role: 'admin' } });
    const requester = await this.prisma.user.findUnique({ where: { id: userId } });

    await Promise.all(
      admins.map((admin) =>
        this.notificationsService.create(admin.id, 'support_ticket', {
          ticketId: ticket.id,
          subject,
          requesterName: requester?.name,
        }),
      ),
    );

    return ticket;
  }

  async getMyTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllTickets(status?: string) {
  return this.prisma.supportTicket.findMany({
    where: status && status !== 'all' ? { status: status as any } : undefined,
    include: { user: { select: { name: true, email: true, role: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

async resolveTicket(id: string) {
  return this.prisma.supportTicket.update({
    where: { id },
    data: { status: 'resolved' },
  });
}
}