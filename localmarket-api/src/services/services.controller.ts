import { Controller, Get, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('providers/:providerId/services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  findByProvider(@Param('providerId') providerId: string) {
    return this.servicesService.findByProvider(providerId);
  }
}