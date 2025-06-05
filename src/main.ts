import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3001);
}
bootstrap();
