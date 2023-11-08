import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaginatedDto<TData> {
  @ApiProperty()
  results: TData[];

  @ApiProperty({ example: 0 })
  @IsNumber()
  total: number;
}
