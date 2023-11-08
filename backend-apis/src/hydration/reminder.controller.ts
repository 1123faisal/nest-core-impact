import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder-log.dto';
import { Reminder } from './entities/reminder.entity';
import { FilterQuery } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetRemindersDto } from './dto/get-reminder.dto';

@ApiTags('Reminder')
@Controller('reminder')
export class ReminderController {
  constructor(private reminderSrv: ReminderService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createReminderDto: CreateReminderDto, @Req() req: any) {
    return this.reminderSrv.create(createReminderDto, req.user.id);
  }

  @Get()
  findAll(@Query() filter: GetRemindersDto): Promise<Reminder[]> {
    return this.reminderSrv.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Reminder> {
    return this.reminderSrv.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReminderDto: CreateReminderDto,
  ) {
    return this.reminderSrv.update(id, updateReminderDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reminderSrv.remove(id);
  }
}
