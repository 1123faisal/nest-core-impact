import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { normalizeEmail } from 'validator';
import { CreateCoachDto } from './create-coach.dto';

export class UpdateCoachDto extends PartialType(CreateCoachDto) {
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email: string;
}
