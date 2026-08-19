import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export enum SignupRole {
  customer = 'customer',
  provider = 'provider',
}

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(SignupRole)
  role!: SignupRole;

  @IsOptional()
  @IsString()
  city?: string;
}