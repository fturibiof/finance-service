import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CategoryEnum } from '../transaction/entities/transaction.entity';

jest.mock('moment', () => () => ({ startOf: jest.fn().mockReturnThis(), endOf: jest.fn().mockReturnThis(), format: jest.fn() }));

describe('BudgetService', () => {
  let service: BudgetService;
  let budgetRepo: Repository<Budget>;

  const mockBudgetRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: getRepositoryToken(Budget),
          useValue: mockBudgetRepo,
        },
      ],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
    budgetRepo = module.get<Repository<Budget>>(getRepositoryToken(Budget));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBudgets', () => {
    it('should return budgets within the date range', async () => {
      const mockBudgets = [{ id: 1, amount: 100 }];
      mockBudgetRepo.find.mockResolvedValue(mockBudgets);

      const result = await service.getBudgets(new Date('2025-03-01'), new Date('2025-03-12'));

      expect(budgetRepo.find).toHaveBeenCalled();
      expect(result).toEqual(mockBudgets);
    });
  });

  describe('findOne', () => {
    it('should return a budget if found', async () => {
      const mockBudget = { id: 1, amount: 100 };
      mockBudgetRepo.findOne.mockResolvedValue(mockBudget);

      const result = await service.findOne(1);

      expect(budgetRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockBudget);
    });

    it('should throw NotFoundException if budget is not found', async () => {
      mockBudgetRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a budget', async () => {
      const createDto: CreateBudgetDto = { amount: 200, category: CategoryEnum.food, startDate: new Date(), endDate: new Date(), description: 'descr' };
      const mockBudget = { id: 1, ...createDto };
      mockBudgetRepo.save.mockResolvedValue(mockBudget);

      const result = await service.create(createDto);

      expect(budgetRepo.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockBudget);
    });
  });

  describe('update', () => {
    it('should update a budget and return the result', async () => {
      const updateDto: UpdateBudgetDto = { amount: 300 };
      mockBudgetRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto);

      expect(budgetRepo.update).toHaveBeenCalledWith({ id: 1 }, updateDto);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should remove a budget and return the result', async () => {
      mockBudgetRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(budgetRepo.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ affected: 1 });
    });
  });
});
