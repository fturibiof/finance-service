import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import {
  CategoryEnum,
  Transaction,
} from '../transaction/entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from './transaction.service';

jest.mock('moment', () => () => ({
  startOf: jest.fn().mockReturnThis(),
  endOf: jest.fn().mockReturnThis(),
  format: jest.fn(),
}));

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepo: Repository<Transaction>;
  let logger: Logger;

  const mockTransactionRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepo,
        },
        Logger
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    logger = module.get<Logger>(Logger);
    transactionRepo = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTransactions', () => {
    it('should return transactions within the date range', async () => {
      const mockTransactions = [{ id: 1, amount: 100 }];
      mockTransactionRepo.find.mockResolvedValue(mockTransactions);

      const result = await service.getTransactions(
        new Date('2025-03-01'),
        new Date('2025-03-12'),
      );

      expect(transactionRepo.find).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('findOne', () => {
    it('should return a transaction if found', async () => {
      const mockTransaction = { id: 1, amount: 100 };
      mockTransactionRepo.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(1);

      expect(transactionRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should throw NotFoundException if transaction is not found', async () => {
      mockTransactionRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a transaction', async () => {
      const createDto: CreateTransactionDto = {
        amount: 200,
        category: CategoryEnum.food,
        date: new Date(),
        description: 'descr',
      };
      const mockTransaction = { id: 1, ...createDto };
      mockTransactionRepo.save.mockResolvedValue(mockTransaction);

      const result = await service.create(createDto);

      expect(transactionRepo.save).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('update', () => {
    it('should update a transaction and return the result', async () => {
      const updateDto: UpdateTransactionDto = { amount: 300 };
      mockTransactionRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto);

      expect(transactionRepo.update).toHaveBeenCalledWith({ id: 1 }, updateDto);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('remove', () => {
    it('should remove a transaction and return the result', async () => {
      mockTransactionRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(transactionRepo.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({ affected: 1 });
    });
  });
});
