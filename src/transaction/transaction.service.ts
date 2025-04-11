import { Between, Repository } from 'typeorm';
import * as moment from 'moment';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    private readonly logger: Logger,
  ) {}

  SERVICE: string = TransactionService.name;

  getTransactions(start?: Date, end?: Date): Promise<Transaction[]> {
    if (!start)
      start = new Date(moment().startOf('month').format('YYYY-MM-DD'));
    if (!end) end = new Date(moment().endOf('month').format('YYYY-MM-DD'));
    this.logger.log(
      `Getting transactions from ${start.toString()} to ${end.toString()}`,
      this.SERVICE,
    );
    return this.transactionRepo.find({
      where: [
        {
          date: Between(start, end),
        },
      ],
    });
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepo.findOne({
      where: {
        id,
      },
    });

    if (!transaction) {
      this.logger.error(`Could not find transaction ${id}`, this.SERVICE);
      throw new NotFoundException();
    }
    return transaction;
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const created = await this.transactionRepo.save(createTransactionDto);
    if (created)
      this.logger.log(
        `Transaction created successfully - ${created.id}`,
        this.SERVICE,
      );
    return created;
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    this.logger.log(`Updating transaction ${id}`, this.SERVICE);
    return await this.transactionRepo.update({ id }, updateTransactionDto);
  }

  async remove(id: number) {
    this.logger.log(`Removing transaction ${id}`, this.SERVICE);
    return await this.transactionRepo.delete({
      id,
    });
  }
}
