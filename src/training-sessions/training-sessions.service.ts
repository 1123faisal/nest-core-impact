import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { TrainingSession } from './entities/training-session.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TrainingSessionsService {
  constructor(
    @InjectModel(TrainingSession.name)
    private readonly TSModel: Model<TrainingSession>,
  ) {}

  async create(createTrainingSessionDto: CreateTrainingSessionDto) {
    return await this.TSModel.create(createTrainingSessionDto);
  }

  async findAll() {
    return await this.TSModel.find();
  }

  async findOne(id: string) {
    const ts = await this.TSModel.findById(id);

    if (!ts) {
      throw new NotFoundException('no session found.');
    }

    return ts;
  }

  async update(id: string, updateTrainingSessionDto: UpdateTrainingSessionDto) {
    const ts = await this.TSModel.findByIdAndUpdate(
      id,
      updateTrainingSessionDto,
      { new: true },
    );

    if (!ts) {
      throw new NotFoundException('no session found.');
    }

    return ts;
  }

  async remove(id: string) {
    const ts = await this.TSModel.findByIdAndDelete(id, { new: true });

    if (!ts) {
      throw new NotFoundException('no session found.');
    }

    return ts;
  }
}
