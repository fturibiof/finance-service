import './tracing';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { instance } from './utils/logger';

async function bootstrap() {
  console.log(`bootstrap`);
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  console.log(`App before listen`);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`App is running on ${await app.getUrl()}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
