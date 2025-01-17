import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { IsAdminEmailAlreadyExist } from 'src/common/decorators/is-admin-email-registered.decorator';
import validator from 'validator';

export class AdminSignUpDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @Transform(({ value }) => validator.normalizeEmail(value))
  @IsAdminEmailAlreadyExist({
    message: 'Email Already Registered.',
  })
  email: string;

  // The password length must be greater than or equal to 8
  // The password must contain one or more uppercase characters
  // The password must contain one or more lowercase characters
  // The password must contain one or more numeric values
  // The password must contain one or more special characters

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
}
