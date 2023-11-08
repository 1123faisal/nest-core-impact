import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { CreateHydrationLogDto } from './dto/create-hydration-log.dto';
import { SetTargetDto } from './dto/set-target.dto';
import { UpdateHydrationLogDto } from './dto/update-hydration-log.dto';
import { Hydration } from './entities/hydration.entity';

@Injectable()
export class HydrationService {
  constructor(
    @InjectModel(Hydration.name)
    private readonly hydrationModel: Model<Hydration>,
  ) {}

  async getLastTarget(uid: string): Promise<Hydration> {
    const item = await this.hydrationModel
      .findOne({ user: uid })
      .sort({ date: -1 });
    if (!item) {
      throw new NotFoundException('item not found.');
    }
    return item;
  }

  async setTarget(setTargetDto: SetTargetDto, uid: string): Promise<Hydration> {
    const currentDate = moment().toDate();
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    return await this.hydrationModel.findOneAndUpdate(
      { date: { $gte: startOfDay, $lt: endOfDay }, user: uid },
      { target: setTargetDto.target, date: currentDate },
      { new: true, upsert: true },
    );
  }

  async create(createHydrationLogDto: CreateHydrationLogDto, uid: string) {
    const item = await this.getLastTarget(uid);
    const { quantity, in: hIn } = createHydrationLogDto;
    item.logs.push({ in: hIn, quantity });
    return await item.save();
  }

  findAll(match?: object): Promise<Hydration[]> {
    return this.hydrationModel.find(match);
  }

  async findOne(id: string) {
    const item = await this.hydrationModel.findById(id);
    if (!item) {
      throw new NotFoundException('item not found.');
    }
    return item;
  }

  async update(
    id: string,
    updateHydrationDto: UpdateHydrationLogDto,
  ): Promise<Hydration> {
    await this.findOne(id);
    return this.hydrationModel.findByIdAndUpdate(
      { _id: id },
      updateHydrationDto,
    );
  }

  async remove(id: string): Promise<Hydration> {
    return await (await this.findOne(id)).deleteOne();
  }
}
