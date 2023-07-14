import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCmsPageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
