import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { IsPasswordSameAsConfirm } from 'src/common/decorators/match-password.decorator';
// import { Match } from 'src/decorators/match-password.decorator';

export class UpdateForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @ApiProperty({ default: 'Test@123' })
  @IsNotEmpty()
  @Length(8, 100)
  @Matches(
    /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    {
      message:
        'The password must contain one or more uppercase,lowercase,numeric,special characters.',
    },
  )
  password: string;

  // @Match('password')
  @IsPasswordSameAsConfirm('password')
  confirmPassword: string;
}
