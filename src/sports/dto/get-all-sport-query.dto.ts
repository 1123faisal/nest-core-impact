import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetAllSportQueryParamDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false })
  search?: string;
}
