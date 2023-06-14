import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { normalizeEmail } from 'validator';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  email: string;
}
