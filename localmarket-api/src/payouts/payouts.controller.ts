import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PayoutsService } from './payouts.service';
import { CreatePayoutMethodDto } from './dto/create-payout-method.dto';

@Controller('payouts')
@UseGuards(JwtAuthGuard)
export class PayoutsController {
  constructor(private payoutsService: PayoutsService) {}

  @Get('me')
  getOverview(@CurrentUser() user: any) {
    return this.payoutsService.getOverview(user.userId);
  }

  @Post('me/methods')
  addMethod(@CurrentUser() user: any, @Body() dto: CreatePayoutMethodDto) {
    return this.payoutsService.addMethod(user.userId, dto);
  }

  @Post('me/request')
  requestPayout(@CurrentUser() user: any, @Body() dto: { amount: number; payoutMethodId: string }) {
    return this.payoutsService.requestPayout(user.userId, dto.amount, dto.payoutMethodId);
  }
}