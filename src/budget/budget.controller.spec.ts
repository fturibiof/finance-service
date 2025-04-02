import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CategoryEnum } from '../transaction/entities/transaction.entity';

describe('BudgetController', () => {
  let controller: BudgetController;
  let service: BudgetService;

  const mockBudgetService = {
    getBudgets: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],
      providers: [{ provide: BudgetService, useValue: mockBudgetService }],
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
    service = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBudgets', () => {
    it('should call getBudgets with correct parameters', async () => {
      const mockBudgets = [{ id: 1, amount: 100 }];
      mockBudgetService.getBudgets.mockResolvedValue(mockBudgets);

      const result = await controller.getBudgets('2025-03-01', '2025-03-12');

      expect(service.getBudgets).toHaveBeenCalledWith(
        new Date('2025-03-01'),
        new Date('2025-03-12'),
      );
      expect(result).toEqual(mockBudgets);
    });
  });

  describe('create', () => {
    it('should call create with correct parameters', async () => {
      const dto: CreateBudgetDto = {
        amount: 200,
        category: CategoryEnum.food,
        startDate: new Date(),
        endDate: new Date(),
        description: 'desc',
      };
      const mockBudget = { id: 1, ...dto };
      mockBudgetService.create.mockResolvedValue(mockBudget);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockBudget);
    });
  });

  describe('findOne', () => {
    it('should call findOne with correct parameters', async () => {
      const mockBudget = { id: 1, amount: 100 };
      mockBudgetService.findOne.mockResolvedValue(mockBudget);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBudget);
    });
  });

  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const dto: UpdateBudgetDto = { amount: 300 };
      const mockBudget = { id: 1, amount: 300 };
      mockBudgetService.update.mockResolvedValue(mockBudget);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockBudget);
    });
  });

  describe('remove', () => {
    it('should call remove with correct parameters', async () => {
      mockBudgetService.remove.mockResolvedValue({ success: true });

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });
  });
});
