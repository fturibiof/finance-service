import { CategoryEnum } from '../../transaction/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: CategoryEnum })
  category: CategoryEnum;

  @Column()
  amount: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;
}
