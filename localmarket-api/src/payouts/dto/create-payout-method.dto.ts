import { IsEnum, IsString, IsNotEmpty } from 'class-validator';

export enum PayoutMethodTypeEnum {
  bank = 'bank', jazzcash = 'jazzcash', easypaisa = 'easypaisa',
}

export class CreatePayoutMethodDto {
  @IsEnum(PayoutMethodTypeEnum)
  type!: PayoutMethodTypeEnum;

  @IsString()
  @IsNotEmpty()
  accountName!: string;

  @IsString()
  @IsNotEmpty()
  accountNumber!: string;
}