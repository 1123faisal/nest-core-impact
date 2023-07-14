import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContactUsDto } from './dto/create-contact-us.dto';
import { UpdateContactUsDto } from './dto/update-contact-us.dto';
import { Contact } from './entities/contact-us.entity';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(Contact.name) private readonly ContactUs: Model<Contact>,
  ) {}

  async create(createContactUsDto: CreateContactUsDto, userId: string) {
    return await this.ContactUs.create({ ...createContactUsDto, user: userId });
  }

  async findAll() {
    return await this.ContactUs.find();
  }

  async findOne(id: string) {
    const item = await this.ContactUs.findById(id);

    if (!item) {
      throw new NotFoundException('no contact us item found');
    }

    return item;
  }

  async update(id: string, updateContactUsDto: UpdateContactUsDto) {
    this.findOne(id);
    await this.ContactUs.findByIdAndUpdate(id, updateContactUsDto);
  }

  async remove(id: string) {
    this.findOne(id);
    await this.ContactUs.findByIdAndRemove(id);
  }
}
