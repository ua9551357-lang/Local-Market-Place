import { Controller, Get, UseGuards,Patch,Body } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('summary')
  getSummary(@CurrentUser() user: any) {
    return this.usersService.getDashboardSummary(user.userId);
  }
   @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.usersService.getMe(user.userId);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: any, @Body() dto: { name?: string; phone?: string; city?: string }) {
    return this.usersService.updateMe(user.userId, dto);
  }

  @Patch('me/notifications')
  updateNotifications(@CurrentUser() user: any, @Body() dto: { notifyEmail?: boolean; notifySms?: boolean }) {
    return this.usersService.updateNotifications(user.userId, dto);
  }
}