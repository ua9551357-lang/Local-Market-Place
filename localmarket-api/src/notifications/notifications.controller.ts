import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findMine(@CurrentUser() user: any) {
    return this.notificationsService.findForUser(user.userId);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser() user: any) {
    return this.notificationsService.unreadCount(user.userId);
  }

  @Post('mark-read')
  markAllRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllRead(user.userId);
  }
}