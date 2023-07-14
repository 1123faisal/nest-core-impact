import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendForgotPasswordOTPDto {
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;
}
