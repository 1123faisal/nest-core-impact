import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
// import { Match } from 'src/decorators/match-password.decorator';

export class OrgSettingDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  logo: Express.Multer.File | string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  @IsString()
  banner: Express.Multer.File | string;
}
