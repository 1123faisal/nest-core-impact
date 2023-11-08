import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';
import { Hydration } from '../entities/hydration.entity';

export class GetHydrationsDto {
  @ApiProperty({ example: { date: '2022-02-02' }, required: false })
  @IsObject()
  @IsOptional()
  match?: Hydration;
}
