import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reminder, ReminderType } from './entities/reminder.entity';
import { FilterQuery, Model } from 'mongoose';
import { CreateReminderDto } from './dto/create-reminder-log.dto';

@Injectable()
export class ReminderService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<Reminder>,
  ) {}

  async create(createReminderDto: CreateReminderDto, uid: string) {
    const item = await this.reminderModel.findOne({ ReminderType: { $ne: ReminderType.Custom } });
    // console.log(item);
    
    // if (ReminderType.Auto) {
    //   throw new BadRequestException('duplicate entry found.');
    // }
    return this.reminderModel.create({ ...createReminderDto, user: uid });
  }

  async findAll(filter: FilterQuery<Reminder>) {
    return this.reminderModel.find(filter);
  }

  async findUserReminder(userId: string): Promise<{ data: Reminder[] }> {
    const userReminder = await this.reminderModel
      .find({ user: userId })
      .sort({ createdAt: -1 });
    return { data: userReminder };
  }
  async findOne(id: string) {
    const item = await this.reminderModel.findById(id);
    if (!item) {
      throw new NotFoundException('item not found');
    }
    return item;
  }

  async update(id: string, createReminderDto: CreateReminderDto) {
    await this.findOne(id);
    return await this.reminderModel.findByIdAndUpdate(id, createReminderDto);
  }

  async remove(id: string) {
    return await (await this.findOne(id)).deleteOne();
  }
}
