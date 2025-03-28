import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetModule } from './budget/budget.module';
import dbConfig from './config/db.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: // TODO: Separate db for prod
        dbConfig,
    }),
    TransactionModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
