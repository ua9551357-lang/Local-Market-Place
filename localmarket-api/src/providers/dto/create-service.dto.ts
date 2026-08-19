import { IsString, IsNotEmpty, IsNumber, IsInt, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(1)
  durationMins!: number;
}