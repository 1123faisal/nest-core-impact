import { Test, TestingModule } from '@nestjs/testing';
import { CmsPagesService } from './cms-pages.service';

describe('CmsPagesService', () => {
  let service: CmsPagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CmsPagesService],
    }).compile();

    service = module.get<CmsPagesService>(CmsPagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
