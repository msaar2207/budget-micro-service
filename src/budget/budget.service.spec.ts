import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';

// Create a mock for BudgetService
const mockBudgetService = {
  // Mock methods and properties as needed
};

describe('BudgetController', () => {
  let controller: BudgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [
        {
          provide: BudgetService,
          useValue: mockBudgetService,
        },
      ],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
