import { Test, TestingModule } from '@nestjs/testing';
import { CmsPagesController } from './cms-pages.controller';
import { CmsPagesService } from './cms-pages.service';

describe('CmsPagesController', () => {
  let controller: CmsPagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmsPagesController],
      providers: [CmsPagesService],
    }).compile();

    controller = module.get<CmsPagesController>(CmsPagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
