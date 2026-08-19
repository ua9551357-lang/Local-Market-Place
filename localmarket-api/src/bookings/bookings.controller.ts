import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(user.userId, dto);
  }

  @Get('me')
  findMine(@CurrentUser() user: any) {
    return this.bookingsService.findMine(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookingsService.findOne(id, user.userId, user.role);
  }

  @Get('provider/me')
findByProvider(@CurrentUser() user: any) {
  return this.bookingsService.findByProvider(user.userId);
}

@Post(':id/status')
updateStatus(
  @Param('id') id: string,
  @CurrentUser() user: any,
  @Body('status') status: 'confirmed' | 'completed' | 'cancelled',
) {
  return this.bookingsService.updateStatusByProvider(user.userId, id, status);
}
}