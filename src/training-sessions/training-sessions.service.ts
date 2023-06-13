import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { TrainingSession } from './entities/training-session.entity';
import { UsersService } from 'src/users/users.service';
import { TrainingsService } from 'src/trainings/trainings.service';

@Injectable()
export class TrainingSessionsService {
  constructor(
    @InjectModel(TrainingSession.name)
    private readonly TSModel: Model<TrainingSession>,
    private readonly athleteService: UsersService,
    private readonly trainingService: TrainingsService,
  ) {}

  async create(
    createTrainingSessionDto: CreateTrainingSessionDto,
    coachId: string,
  ) {
    const athletes = await this.athleteService.findUser({
      _id: { $in: createTrainingSessionDto.athletes },
    });

    if (athletes.length != createTrainingSessionDto.athletes.length) {
      throw new ConflictException('invalid athletes id detected.');
    }

    await this.trainingService.findOne(createTrainingSessionDto.exercise);

    return await this.TSModel.create({
      ...createTrainingSessionDto,
      coach: coachId,
    });
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
