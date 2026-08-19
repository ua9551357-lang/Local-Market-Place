import { IsEmail, IsString, IsNotEmpty, MinLength, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterProviderDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  experienceYears!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom!: number;
}