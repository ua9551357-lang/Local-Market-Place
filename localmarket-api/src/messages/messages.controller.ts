import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('threads')
  getThreads(@CurrentUser() user: any) {
    return this.messagesService.getThreadsForUser(user.userId, user.role);
  }

  @Post('threads')
  getOrCreateThread(
    @CurrentUser() user: any,
    @Body('providerId') providerId: string,
    @Body('bookingId') bookingId?: string,
  ) {
    return this.messagesService.getOrCreateThread(user.userId, providerId, bookingId);
  }

  @Get('messages')
  getMessages(@Query('threadId') threadId: string) {
    return this.messagesService.getMessages(threadId);
  }
}