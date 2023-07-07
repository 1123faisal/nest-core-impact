import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContactUsService } from './contact-us.service';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { isMongoIdPipe } from 'src/common/pipes/is-mongo-id.pipe';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Contact Us')
@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  create(@Body() createContactUsDto: CreateContactUsDto, @Req() req) {
    return this.contactUsService.create(createContactUsDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.contactUsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', isMongoIdPipe) id: string) {
    return this.contactUsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', isMongoIdPipe) id: string,
    @Body() updateContactUsDto: UpdateContactUsDto,
  ) {
    return this.contactUsService.update(id, updateContactUsDto);
  }

  @Delete(':id')
  remove(@Param('id', isMongoIdPipe) id: string) {
    return this.contactUsService.remove(id);
  }
}
