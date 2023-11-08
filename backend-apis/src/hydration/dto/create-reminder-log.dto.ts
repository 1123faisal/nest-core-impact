import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReminderType } from '../entities/reminder.entity';

export class CreateReminderDto {
  @ApiProperty({ example: ReminderType.Auto })
  // @IsEnum({ type: ReminderType })
  @IsOptional()
  reminderType: ReminderType;

  @ApiProperty({ example: '12:12 AM' })
  @IsOptional()
  time: string;

  @ApiProperty({ example: '12:12 AM' })
  @IsOptional()
  startTime: string;

  @ApiProperty({ example: '12:12 AM' })
  @IsOptional()
  endTime: string;
}
