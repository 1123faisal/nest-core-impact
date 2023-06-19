import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import validator from 'validator';
import { CreateCoachDto } from './create-coach.dto';

export class UpdateCoachDto extends PartialType(CreateCoachDto) {
  @IsEmail()
  @Transform(({ value }) => validator.normalizeEmail(value))
  email: string;
}
