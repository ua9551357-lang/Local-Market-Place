import { Controller, Get, Put, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AvailabilityService } from './availability.service';
import { AvailabilitySlotDto } from './dto/upsert-availability.dto';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get('me')
  getMine(@CurrentUser() user: any) {
    return this.availabilityService.getMySlots(user.userId);
  }

  @Put('me')
  updateSlots(@CurrentUser() user: any, @Body('slots') slots: AvailabilitySlotDto[]) {
    return this.availabilityService.updateSlots(user.userId, slots);
  }

  @Patch('me/preferences')
  updatePreferences(
    @CurrentUser() user: any,
    @Body() dto: { acceptingBookings?: boolean; advanceBookingDays?: number; bufferTimeMins?: number },
  ) {
    return this.availabilityService.updatePreferences(user.userId, dto);
  }
}