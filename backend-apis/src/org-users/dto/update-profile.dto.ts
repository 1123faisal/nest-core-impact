import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import validator from 'validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  name: string;

  // @IsEmail()
  // @Transform(({ value }) => validator.normalizeEmail(value))
  // email: string;

  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  avatar: Express.Multer.File | string;
}
