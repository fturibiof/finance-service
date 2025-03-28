import { IsDate, IsEnum, IsNumber, IsString } from "class-validator";
import { CategoryEnum } from "../../transaction/entities/transaction.entity";


export class CreateBudgetDto {
  @IsNumber()
  amount: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  description: string

  @IsEnum(CategoryEnum)
  category: CategoryEnum;
}