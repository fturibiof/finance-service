import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum CategoryEnum {
  rent = 'rent',
  leisure = 'leisure',
  food = 'food',
  transportation = 'transportation',
  other = 'other'
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: CategoryEnum })
  category: CategoryEnum

  @Column()
  amount: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  description?: string;

}
