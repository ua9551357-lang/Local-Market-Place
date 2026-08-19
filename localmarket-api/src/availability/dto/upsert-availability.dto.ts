import { IsEnum, IsString, IsBoolean } from 'class-validator';

export enum DayOfWeekEnum {
  monday = 'monday', tuesday = 'tuesday', wednesday = 'wednesday',
  thursday = 'thursday', friday = 'friday', saturday = 'saturday', sunday = 'sunday',
}

export class AvailabilitySlotDto {
  @IsEnum(DayOfWeekEnum)
  day!: DayOfWeekEnum;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsBoolean()
  isAvailable!: boolean;
}