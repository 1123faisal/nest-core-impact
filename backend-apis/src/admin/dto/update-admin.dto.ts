import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';
import validator from 'validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsEmail()
  @Transform(({ value }) => validator.normalizeEmail(value))
  email: string;
}
