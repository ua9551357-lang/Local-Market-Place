import { IsString, IsNotEmpty, IsInt, IsOptional, Min } from 'class-validator';

export class ApplyProviderDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsInt()
  @Min(0)
  experienceYears: number;

  @IsInt()
  @Min(0)
  priceFrom: number;

  @IsOptional()
  @IsString()
  location?: string;
}