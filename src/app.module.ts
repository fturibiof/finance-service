import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetModule } from './budget/budget.module';

// function withRetries<T>(
//   fn: () => Promise<T>,
//   retries = 5,
//   delay = 2000,
// ): Promise<T> {
//   return fn().catch(async (err) => {
//     if (retries <= 0) throw err;
//     console.warn(`TypeORM connection failed. Retrying in ${delay}ms...`);
//     await new Promise((res) => setTimeout(res, delay));
//     return withRetries(fn, retries - 1, delay * 2);
//   });
// }

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        // withRetries(async () => {
        {
          return {
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
            username: configService.get('DB_USER'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            autoLoadEntities: true,
            synchronize: true,
          };
        },
      // }),
    }),
    PrometheusModule.register(),
    TransactionModule,
    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
