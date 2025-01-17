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
import { checkLogoAndBannerPipe } from 'src/common/pipes/validate-logo-banner.pipe';
import { OrgSettingDto } from 'src/org-users/dto/org-db-setting.dto';
import { OrgSetting } from 'src/org-users/entities/settings.entity';
import { PaginatedDto } from 'src/common/dtos/paginates.dto';
import { AdminsService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { JwtAuthGuardIsAdmin } from './jwt-auth.guard';

@ApiTags("Admin's")
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  create(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Body() createAthleteDto: CreateAdminDto,
  ) {
    createAthleteDto.avatar = file;
    return this.adminService.create(createAthleteDto);
  }

  @Patch(':id/unassign-coaches')
  async unassignCoaches(@Param('id') id: string) {
    await this.adminService.unassignCoaches(id);
    return { message: 'Coaches Unassigned' };
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ): Promise<PaginatedDto<Admin>> {
    return this.adminService.findAll(skip, limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
  @Get('db-settings')
  @HttpCode(HttpStatus.OK)
  async getDashboardSetting(): Promise<OrgSetting> {
    return this.adminService.getDashboardSetting();
  }

  @Get(':id')
  findOne(@Param('id', isMongoIdPipe) id: string): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':id')
  update(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Param('id', isMongoIdPipe) id: string,
    @Body() updateAthleteDto: UpdateAdminDto,
  ): Promise<Admin> {
    updateAthleteDto.avatar = file;
    return this.adminService.update(id, updateAthleteDto);
  }

  @Delete(':id')
  remove(@Param('id', isMongoIdPipe) id: string) {
    return this.adminService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuardIsAdmin)
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
    return await this.adminService.updateDashboardSetting(orgSettingDto);
  }
}
