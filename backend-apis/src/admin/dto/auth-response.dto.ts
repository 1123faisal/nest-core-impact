import { IsEmail, IsString } from 'class-validator';

export class AuthResponse {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
