import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateSportDto } from './dto/create-sport.dto';
import { GetAllSportQueryParamDto } from './dto/get-all-sport-query.dto';
import { PaginatedDto } from '../common/dtos/paginates.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';
import { SportsService } from './sports.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';

// @ApiBearerAuth()
@ApiExtraModels(PaginatedDto)
@UseGuards(JwtAuthGuard)
@ApiTags('sports')
@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Post()
  create(
    @Body() createSportDto: CreateSportDto,
    @Request() req,
  ): Promise<Sport> {
    return this.sportsService.create(createSportDto, req.user.id);
  }

  // @ApiPaginatedResponse(Sport)
  @Get()
  async findAll(
    @Query() getAllSportQueryParamDto?: GetAllSportQueryParamDto,
  ): Promise<{ message: string; data: PaginatedDto<Sport> }> {
    const result = await this.sportsService.findAll(getAllSportQueryParamDto);
    return { message: 'Users retrieved successfully', data: result };
  }

  @Get(':id')
  findOne(@Param('id', isMongoIdPipe) id: string): Promise<Sport> {
    return this.sportsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', isMongoIdPipe) id: string,
    @Body() updateSportDto: UpdateSportDto,
  ): Promise<Sport> {
    return this.sportsService.update(id, updateSportDto);
  }

  @Delete(':id')
  remove(@Param('id', isMongoIdPipe) id: string) {
    return this.sportsService.remove(id);
  }

  @Patch('users/update')
  updateSportByUser(
    @Body() updateSportDto: UpdateSportDto,
    @Request() req,
  ): Promise<Sport> {
    return this.sportsService.updateSportByUser(updateSportDto, req.user.id);
  }
}
