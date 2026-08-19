import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class QueryProvidersDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  minRating?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsIn(['available', 'later'])
  availability?: string;

  @IsOptional()
  @IsIn(['recommended', 'rating', 'price_low', 'price_high'])
  sort?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}