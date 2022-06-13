import { Test, TestingModule } from '@nestjs/testing';
import { LinterService } from './linter.service';

describe('LinterService', () => {
  let service: LinterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinterService],
    }).compile();

    service = module.get<LinterService>(LinterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
