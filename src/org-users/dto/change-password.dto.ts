import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';
import { IsPasswordSameAsConfirm } from 'src/decorators/match-password.decorator';
// import { Match } from 'src/decorators/match-password.decorator';

export class ChangePasswordDto {
  @ApiProperty({ default: 'Test@123' })
  @IsNotEmpty()
  oldPassword: string;

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
  newPassword: string;

  // @Match('password')
  @IsPasswordSameAsConfirm('password')
  confirmPassword: string;
}
