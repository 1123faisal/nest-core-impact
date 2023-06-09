import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { isValidAvatar } from 'src/common/pipes/is-avatar.pipe';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';
import { JwtAuthGuard } from 'src/org-users/jwt-auth.guard';
import { PaginatedDto } from 'src/sports/dto/paginates.dto';
import { CoachsService } from './coachs.service';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Coach } from './entities/coach.entity';
import { checkLogoAndBannerPipe } from 'src/common/pipes/validate-logo-banner.pipe';
import { OrgSettingDto } from 'src/org-users/dto/org-db-setting.dto';
import { OrgSetting } from 'src/org-users/entities/settings.entity';
import { User } from 'src/users/entities/user.entity';

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
  getAthletes(@Req() { user }): Promise<User[]> {
    return this.coachService.getAthletes(user.id);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ): Promise<PaginatedDto<Coach>> {
    return this.coachService.findAll(skip, limit);
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

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  @Patch('update-db-settings')
  @HttpCode(HttpStatus.OK)
  async updateDashboardSetting(
    @UploadedFiles(checkLogoAndBannerPipe)
    files: {
      logo: Express.Multer.File[];
      banner: Express.Multer.File[];
    },
    @Body() orgSettingDto: OrgSettingDto, // : Promise<OrgSetting>
  ): Promise<OrgSetting> {
    orgSettingDto.logo = files.logo ? files.logo.at(0) : null;
    orgSettingDto.banner = files.banner ? files.banner.at(0) : null;
    return await this.coachService.updateDashboardSetting(orgSettingDto);
  }

  @Get('db-settings')
  @HttpCode(HttpStatus.OK)
  async getDashboardSetting(): Promise<OrgSetting> {
    return this.coachService.getDashboardSetting();
  }
}
