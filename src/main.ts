import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CLIENT_URL, IS_PROD, PORT } from './constants';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  console.log(IS_PROD && 'YOUR ARE IN PRODUCTION !!');
  if (!IS_PROD) {
    app.enableCors({
      credentials: true,
      origin: ['http://localhost:3000'],
      exposedHeaders: ['Set-cookie'],
    });
  } else {
    app.enableCors({
      origin: CLIENT_URL,
      exposedHeaders: ['Set-Cookie'],
      credentials: true,
    });
  }
  await app.listen(PORT || 5000);
}
bootstrap();
