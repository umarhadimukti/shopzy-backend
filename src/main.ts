import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { DecimalInterceptor } from './common/decimal/decimal.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = app.get(PinoLogger);
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieParser());

  app.useGlobalInterceptors(new DecimalInterceptor());

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
  });

  app.useStaticAssets('public', {
    setHeaders: (res, path) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  });

  const configService = app.get<ConfigService>(ConfigService);
  await app.listen(configService.get<number>('PORT') || 3001);
}
bootstrap();
