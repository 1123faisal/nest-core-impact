import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from 'src/users/entities/types';

export class AuthResponse {
  @IsEmail()
  email: string;

  @IsEnum(Object.values(Role))
  role: Role;

  @IsString()
  token: string;

  @IsBoolean()
  isSportAvailable: boolean;
}
