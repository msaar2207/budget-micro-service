import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from './budget.service';
import { TimeUnit } from '../common/enums/timeUnits';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetService],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllEntries', () => {
    it('should return entries for a given user', async () => {
      // Mock the budgetModel.find method
      const result = [];
      service.findOne = jest.fn().mockResolvedValue(result);
      expect(await service.getAllEntries('userId')).toEqual(result);
    });
    // ... more tests ...
  });
  describe('getBudgetTrends', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service.calculateTrend = jest
        .fn()
        .mockImplementation((userId, startDate, endDate, label) => {
          return Promise.resolve({ label, total: 123 });
        });
    });

    it('should calculate trends correctly for months', async () => {
      const trends = await service.getBudgetTrends(
        'userId',
        2,
        TimeUnit.Months,
      );
      expect(trends.trends).toHaveLength(2);
      expect(service.calculateTrend).toHaveBeenCalledTimes(2);
    });

    it('should calculate trends correctly for days', async () => {
      const trends = await service.getBudgetTrends('userId', 5, TimeUnit.Days);
      expect(trends.trends).toHaveLength(5);
      expect(service.calculateTrend).toHaveBeenCalledTimes(5);
    });

    // Add more test cases for other time units (Years, Weeks, Quarters)
  });
});
