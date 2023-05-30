import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

function FileApiProperty(): PropertyDecorator {
  return ApiProperty({ type: 'string', format: 'binary' });
}

export class UpdateProfilePicDto {
  @FileApiProperty()
  @IsOptional()
  @IsString()
  avatar: any;
}
