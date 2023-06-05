import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetAllSportQueryParamDto {
  @ApiProperty({ example: 1, required: false })
  @IsString()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsString()
  limit?: number;

  @ApiProperty({ required: false })
  search?: string;
}
