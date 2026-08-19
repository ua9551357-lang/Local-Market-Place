import { IsString, IsNotEmpty, IsDateString, IsOptional, IsIn, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  providerId!: string;

  @IsString()
  @IsNotEmpty()
  serviceId!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsNotEmpty()
  time!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  issueDesc?: string;

  @IsNumber()
  amount!: number;

  @IsIn(['cash', 'online'])
  paymentMethod!: 'cash' | 'online';
}