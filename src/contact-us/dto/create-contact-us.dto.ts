import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { IsEmailUserAlreadyExist } from 'src/decorators/is-email-registered.decorator';
import { normalizeEmail } from 'validator';

export class CreateContactUsDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  @Transform(({ value }) => normalizeEmail(value))
  @IsEmailUserAlreadyExist({
    message: 'Email Already Registered.',
  })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'some message...' })
  @IsString()
  message: string;
}
