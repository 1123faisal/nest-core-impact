import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender, Role } from '../entities/types';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 'JD', required: false })
  @IsString()
  @IsOptional()
  nickname: string;

  @ApiProperty({ example: '6.5', required: false })
  @IsString()
  @IsOptional()
  height: string;

  @ApiProperty({ example: 'cm', required: false })
  @IsString()
  @IsOptional()
  heightIn: string;

  @ApiProperty({ example: '80', required: false })
  @IsString()
  @IsOptional()
  weight: string;

  @ApiProperty({ example: 'kg', required: false })
  @IsString()
  @IsOptional()
  weightIn: string;

  @ApiProperty({ example: Gender.Male, required: false })
  @IsString()
  @IsOptional()
  @IsEnum(Object.values(Gender))
  gender: Gender;

  @ApiProperty({ example: 'United State', required: false })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ example: 'Texas', required: false })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ example: '75462', required: false })
  @IsString()
  @IsOptional()
  zipCode: string;

  @ApiProperty({ example: Role.Elite, required: false })
  @IsOptional()
  @IsEnum(Object.values(Role))
  role: Role;
}
