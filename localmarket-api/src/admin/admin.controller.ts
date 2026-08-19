import { Controller, Get, Post, Param, Query, Body, UseGuards,Patch,Delete,Res} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import type { Response } from 'express';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
getStats(@Query('month') month?: string) {
  return this.adminService.getStats(month);
}

@Get('export')
async exportBookings(@Query('month') month: string, @Res() res: Response) {
  const csv = await this.adminService.exportBookingsCsv(month);
  res.header('Content-Type', 'text/csv');
  res.attachment(`bookings-${month || 'all-time'}.csv`);
  res.send(csv);
}

  @Get('users')
  getUsers(@Query('role') role?: string) {
    return this.adminService.getUsers(role);
  }

  @Get('providers')
  getProviders() {
    return this.adminService.getProviders();
  }

  @Post('providers/:id/verify')
  verifyProvider(@Param('id') id: string, @Body('verified') verified: boolean) {
    return this.adminService.verifyProvider(id, verified);
  }

  @Get('bookings')
  getBookings() {
    return this.adminService.getBookings();
  }
   
   @Get('payments')
  getPayments() {
    return this.adminService.getPayments();
  }

  @Get('reviews')
  getReviews() {
    return this.adminService.getAllReviews();
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }

  @Get('categories')
  getCategories() {
    return this.adminService.getCategoriesWithStats();
  }

  @Post('categories')
  createCategory(@Body() dto: { name: string; icon?: string }) {
    return this.adminService.createCategory(dto);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: { name?: string; icon?: string }) {
    return this.adminService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  @Get('reports')
  getReports() {
    return this.adminService.getReports();
  }

  @Get('settings')
getSettings() {
  return this.adminService.getSettings();
}

@Patch('settings')
updateSettings(@Body() dto: UpdateSettingsDto) {
  return this.adminService.updateSettings(dto);
}

@Get('provider-applications')
getProviderApplications(@Query('status') status?: string) {
  return this.adminService.getProviderApplications(status);
}

@Post('provider-applications/:id/approve')
approveProvider(@Param('id') id: string) {
  return this.adminService.approveProviderApplication(id);
}

@Post('provider-applications/:id/reject')
rejectProvider(@Param('id') id: string) {
  return this.adminService.rejectProviderApplication(id);
}
}