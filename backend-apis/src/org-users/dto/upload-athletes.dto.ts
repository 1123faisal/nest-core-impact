import { IsOptional, IsString } from 'class-validator';
import { FileApiProperty } from 'src/users/dto/update-profile-pic-dto';

export class UploadAthletesDto {
  @FileApiProperty()
  @IsOptional()
  @IsString()
  file: Express.Multer.File;
}
