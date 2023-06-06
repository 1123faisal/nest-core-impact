import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsCoachEmailAlreadyExist } from 'src/common/decorators/is-coach-email-registered.decorator';
import { Gender } from 'src/users/entities/types';
import { normalizeEmail } from 'validator';

export class CreateCoachDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  @IsCoachEmailAlreadyExist({
    message: 'Email Already Registered.',
  })
  email: string;

  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  avatar: Express.Multer.File | string;

  @ApiProperty({ example: Gender.Male, required: false })
  @IsString()
  @IsOptional()
  @IsEnum(Object.values(Gender))
  gender: Gender;
}
