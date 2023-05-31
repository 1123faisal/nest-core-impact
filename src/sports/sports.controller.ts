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
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiPaginatedResponse } from 'src/decorators/paginated-response.decorator';
import { CreateSportDto } from './dto/create-sport.dto';
import { GetAllSportQueryParamDto } from './dto/get-all-sport-query.dto';
import { PaginatedDto } from './dto/paginates.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';
import { SportsService } from './sports.service';

@ApiBearerAuth()
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

  @ApiPaginatedResponse(Sport)
  @Get()
  findAll(
    @Query() getAllSportQueryParamDto?: GetAllSportQueryParamDto,
  ): Promise<PaginatedDto<Sport>> {
    return this.sportsService.findAll(getAllSportQueryParamDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Sport> {
    return this.sportsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSportDto: UpdateSportDto,
  ): Promise<Sport> {
    return this.sportsService.update(id, updateSportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
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
