import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import validator from 'validator';
import { CreateAthleteDto } from './create-athlete.dto';

export class UpdateAthleteDto extends PartialType(CreateAthleteDto) {
  @IsEmail()
  @Transform(({ value }) => validator.normalizeEmail(value))
  email: string;
}
