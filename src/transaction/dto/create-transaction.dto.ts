import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';
import { CategoryEnum } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsDate()
  date: Date;

  @IsString()
  description: string;

  @IsEnum(CategoryEnum)
  category: CategoryEnum;
}
