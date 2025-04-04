import { Between, Repository } from 'typeorm';
import * as moment from 'moment';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget) private budgetRepo: Repository<Budget>,
    private readonly logger: Logger,
  ) {}
  SERVICE: string = BudgetService.name;

  getBudgets(start?: Date, end?: Date): Promise<Budget[]> {
    if (!start)
      start = new Date(moment().startOf('month').format('YYYY-MM-DD'));
    if (!end) end = new Date(moment().endOf('month').format('YYYY-MM-DD'));
    this.logger.log(
      `Getting budgets from ${start.toString()} to ${end.toString()}`,
      this.SERVICE,
    );
    return this.budgetRepo.find({
      where: [
        {
          startDate: Between(start, end),
        },
        {
          endDate: Between(start, end),
        },
      ],
    });
  }

  async findOne(id: number) {
    const budget = await this.budgetRepo.findOne({
      where: {
        id,
      },
    });

    if (!budget) {
      this.logger.error(`Could not find budget ${id}`, undefined, this.SERVICE);
      throw new NotFoundException();
    }
    return budget;
  }

  async create(createBudgetDto: CreateBudgetDto) {
    const created = await this.budgetRepo.save(createBudgetDto);
    if (created)
      this.logger.log(
        `Budget created successfully - ${created.id}`,
        this.SERVICE,
      );
    return created;
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    this.logger.log(`Updating budget ${id}`, this.SERVICE);
    return await this.budgetRepo.update({ id }, updateBudgetDto);
  }

  async remove(id: number) {
    this.logger.log(`Removing budget ${id}`, this.SERVICE);
    return await this.budgetRepo.delete({
      id,
    });
  }
}
