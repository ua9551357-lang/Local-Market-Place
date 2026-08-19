import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards,Patch,BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProvidersService } from './providers.service';
import { QueryProvidersDto } from './dto/query-providers.dto';
import { ApplyProviderDto } from './dto/apply-provider.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('providers')
export class ProvidersController {
  constructor(private providersService: ProvidersService) {}

  @Get()
  findAll(@Query() query: QueryProvidersDto) {
    return this.providersService.findAll(query);
  }

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  apply(@CurrentUser() user: any, @Body() dto: ApplyProviderDto) {
    return this.providersService.applyAsProvider(user.userId, dto);
  }

  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@CurrentUser() user: any) {
    return this.providersService.getMyProfile(user.userId);
  }

  @Get('me/earnings')
  @UseGuards(JwtAuthGuard)
  getEarnings(@CurrentUser() user: any) {
    return this.providersService.getEarnings(user.userId);
  }

  @Post('me/services')
  @UseGuards(JwtAuthGuard)
  createService(@CurrentUser() user: any, @Body() dto: CreateServiceDto) {
    return this.providersService.createService(user.userId, dto);
  }

  @Delete('me/services/:serviceId')
  @UseGuards(JwtAuthGuard)
  deleteService(@CurrentUser() user: any, @Param('serviceId') serviceId: string) {
    return this.providersService.deleteService(user.userId, serviceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @Get('me/earnings-chart')
@UseGuards(JwtAuthGuard)
getEarningsChart(@CurrentUser() user: any) {
  return this.providersService.getEarningsChart(user.userId);
}

@Patch('me/profile')
@UseGuards(JwtAuthGuard)
updateMyProfile(@CurrentUser() user: any, @Body() dto: any) {
  return this.providersService.updateMyProfile(user.userId, dto);
}

@Patch('me/notifications')
@UseGuards(JwtAuthGuard)
updateNotifications(@CurrentUser() user: any, @Body() dto: { notifyEmail?: boolean; notifySms?: boolean }) {
  return this.providersService.updateNotificationPrefs(user.userId, dto);
}

@Post('me/avatar')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
  FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new BadRequestException('Only image files (jpg, png, webp) are allowed'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
)
async uploadAvatar(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
  if (!file) throw new BadRequestException('No file uploaded');
  const avatarUrl = `/uploads/avatars/${file.filename}`;
  return this.providersService.updateAvatar(user.userId, avatarUrl);
}

@Post(':id/save')
@UseGuards(JwtAuthGuard)
toggleSave(@CurrentUser() user: any, @Param('id') id: string) {
  return this.providersService.toggleSave(user.userId, id);
}

@Get('me/saved')
@UseGuards(JwtAuthGuard)
getSaved(@CurrentUser() user: any) {
  return this.providersService.getSavedProviders(user.userId);
}

@Get('me/saved-ids')
@UseGuards(JwtAuthGuard)
getSavedIds(@CurrentUser() user: any) {
  return this.providersService.getSavedProviderIds(user.userId);
}
}