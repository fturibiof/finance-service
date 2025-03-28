import { Between, Repository } from 'typeorm';
import * as moment from "moment";
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {

  constructor(@InjectRepository(Budget) private budgetRepo: Repository<Budget>) { }

  getBudgets(start?: Date, end?: Date): Promise<Budget[]> {
    if (!start) start = new Date(moment().startOf('month').format('YYYY-MM-DD'));
    if (!end) end = new Date(moment().endOf('month').format('YYYY-MM-DD'));
    return this.budgetRepo.find({
      where: [
        {
          startDate: Between(start, end),
        },
        {
          endDate: Between(start, end),
        },
      ]
    });
  }

  async findOne(id: number) {
    const budget = await this.budgetRepo.findOne({
      where: {
        id,
      },
    });

    if (!budget) throw new NotFoundException();
    return budget;
  }

  async create(createBudgetDto: CreateBudgetDto) {
    const created = await this.budgetRepo.save(createBudgetDto);
    return created;
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return await this.budgetRepo.update({ id }, updateBudgetDto);
  }

  async remove(id: number) {
    return await this.budgetRepo.delete({
      id,
    });
  }
}
