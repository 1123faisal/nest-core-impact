import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ReminderType } from '../entities/reminder.entity';

export class CreateReminderDto {
  @ApiProperty({ example: ReminderType.Auto })
  @IsEnum({ type: ReminderType })
  reminderType: ReminderType;

  @ApiProperty({ example: '12:12 AM' })
  @IsString()
  time: string;

  @ApiProperty({ example: '12:12 AM' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '12:12 AM' })
  @IsString()
  endTime: string;
}
