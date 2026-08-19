import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  findByProvider(@Query('providerId') providerId: string) {
    return this.reviewsService.findByProvider(providerId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.userId, dto);
  }

  @Get('my')
@UseGuards(JwtAuthGuard)
findMine(@CurrentUser() user: any) {
  return this.reviewsService.findByCustomer(user.userId);
}
}