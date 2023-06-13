import { Test, TestingModule } from '@nestjs/testing';
import { TrainingSessionsController } from './training-sessions.controller';
import { TrainingSessionsService } from './training-sessions.service';

describe('TrainingSessionsController', () => {
  let controller: TrainingSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingSessionsController],
      providers: [TrainingSessionsService],
    }).compile();

    controller = module.get<TrainingSessionsController>(TrainingSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
