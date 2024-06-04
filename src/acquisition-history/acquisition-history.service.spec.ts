import { Test, TestingModule } from '@nestjs/testing';
import { AcquisitionHistoryService } from './acquisition-history.service';

describe('AcquisitionHistoryService', () => {
  let service: AcquisitionHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcquisitionHistoryService],
    }).compile();

    service = module.get<AcquisitionHistoryService>(AcquisitionHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
