import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { isValidAvatar } from 'src/common/pipes/is-avatar.pipe';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';
import { JwtAuthGuardIsOrg } from 'src/org-users/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { PaginatedDto } from 'src/sports/dto/paginates.dto';

@ApiTags('Athletes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuardIsOrg) // Protect the route with JWT authentication
@Controller('athletes')
export class AthletesController {
  constructor(private readonly athletesService: AthletesService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  create(
    @UploadedFile(isValidAvatar)
    avatar: Express.Multer.File,
    @Body() createAthleteDto: CreateAthleteDto,
  ) {
    createAthleteDto.avatar = avatar;
    return this.athletesService.create(createAthleteDto);
  }

  @Get()
  findAll(
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ): Promise<PaginatedDto<User>> {
    return this.athletesService.findAll(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id', isMongoIdPipe)  id: string): Promise<User> {
    return this.athletesService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch(':id')
  update(
    @UploadedFile(isValidAvatar)
    file: Express.Multer.File,
    @Param('id', isMongoIdPipe)  id: string,
    @Body() updateAthleteDto: UpdateAthleteDto,
  ): Promise<User> {
    updateAthleteDto.avatar = file;
    console.log(updateAthleteDto);

    return this.athletesService.update(id, updateAthleteDto);
  }

  @Delete(':id')
  remove(@Param('id', isMongoIdPipe)  id: string) {
    return this.athletesService.remove(id);
  }
}
