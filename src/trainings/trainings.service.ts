import { Injectable } from '@nestjs/common';
import { CreateTrainingDto, Step } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';

@Injectable()
export class TrainingsService {
  create(createTrainingDto: CreateTrainingDto, userId: string) {
    const steps: Step[] = JSON.parse(createTrainingDto.steps);
    return 'This action adds a new training';
  }

  findAll() {
    return `This action returns all trainings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} training`;
  }

  update(id: number, updateTrainingDto: UpdateTrainingDto, userId: string) {
    const steps: Step[] = JSON.parse(updateTrainingDto.steps);
    return `This action updates a #${id} training`;
  }

  remove(id: number) {
    return `This action removes a #${id} training`;
  }
}
