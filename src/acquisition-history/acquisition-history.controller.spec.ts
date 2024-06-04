import { Test, TestingModule } from '@nestjs/testing';
import { AcquisitionHistoryController } from './acquisition-history.controller';
import { AcquisitionHistoryService } from './acquisition-history.service';

describe('AcquisitionHistoryController', () => {
  let controller: AcquisitionHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcquisitionHistoryController],
      providers: [AcquisitionHistoryService],
    }).compile();

    controller = module.get<AcquisitionHistoryController>(AcquisitionHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
