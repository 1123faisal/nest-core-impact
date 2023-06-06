import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { isValidAvatar } from 'src/common/pipes/is-avatar.pipe';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';
import { JwtAuthGuard } from 'src/org-users/jwt-auth.guard';
import { CoachsService } from './coachs.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Coach } from './entities/coach.entity';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags("Coach's")
@Controller('coachs')
export class CoachsController {
  constructor(private readonly coachService: CoachsService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  create(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Body() createAthleteDto: CreateCoachDto,
  ) {
    createAthleteDto.avatar = file;
    return this.coachService.create(createAthleteDto);
  }

  @Get()
  findAll(): Promise<Coach[]> {
    return this.coachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', isMongoIdPipe) id: string): Promise<Coach> {
    return this.coachService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':id')
  update(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Param('id', isMongoIdPipe) id: string,
    @Body() updateAthleteDto: UpdateCoachDto,
  ): Promise<Coach> {
    updateAthleteDto.avatar = file;
    return this.coachService.update(id, updateAthleteDto);
  }

  @Delete(':id')
  remove(@Param('id', isMongoIdPipe) id: string) {
    return this.coachService.remove(id);
  }
}
