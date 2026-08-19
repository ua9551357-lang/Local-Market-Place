import { Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SupportService } from './support.service';
import { Controller, Post, Get, Patch, Param, Query, } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('tickets')
  create(@CurrentUser() user: any, @Body() dto: { subject: string; message: string }) {
    return this.supportService.createTicket(user.userId, dto.subject, dto.message);
  }

  @Get('tickets/me')
  getMine(@CurrentUser() user: any) {
    return this.supportService.getMyTickets(user.userId);
  }

  @Get('admin/tickets')
@UseGuards(RolesGuard)
@Roles('admin')
getAllTickets(@Query('status') status?: string) {
  return this.supportService.getAllTickets(status);
}

@Patch('admin/tickets/:id/resolve')
@UseGuards(RolesGuard)
@Roles('admin')
resolveTicket(@Param('id') id: string) {
  return this.supportService.resolveTicket(id);
}
}