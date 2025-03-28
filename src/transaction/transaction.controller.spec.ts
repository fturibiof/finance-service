import { Test, TestingModule } from '@nestjs/testing';
import { CategoryEnum } from '../transaction/entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransactionService = {
    getTransactions: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TransactionService, useValue: mockTransactionService }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTransactions', () => {
    it('should call getTransactions with correct parameters', async () => {
      const mockTransactions = [{ id: 1, amount: 100 }];
      mockTransactionService.getTransactions.mockResolvedValue(mockTransactions);

      const result = await controller.getTransactions('2025-03-01', '2025-03-12');

      expect(service.getTransactions).toHaveBeenCalledWith(new Date('2025-03-01'), new Date('2025-03-12'));
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('create', () => {
    it('should call create with correct parameters', async () => {
      const dto: CreateTransactionDto = { amount: 200, category: CategoryEnum.food, date: new Date(), description: 'desc' };
      const mockTransaction = { id: 1, ...dto };
      mockTransactionService.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('findOne', () => {
    it('should call findOne with correct parameters', async () => {
      const mockTransaction = { id: 1, amount: 100 };
      mockTransactionService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const dto: UpdateTransactionDto = { amount: 300 };
      const mockTransaction = { id: 1, amount: 300 };
      mockTransactionService.update.mockResolvedValue(mockTransaction);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('remove', () => {
    it('should call remove with correct parameters', async () => {
      mockTransactionService.remove.mockResolvedValue({ success: true });

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });
  });
});
