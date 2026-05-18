import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    try {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: 'https://web-corse-work-jjhb.vercel.app',
    credentials: true,
  });

  app.use(cookieParser());

  // app.use('/webhook/stripe', express.raw({ type: 'application/json' }));

  await app.listen(process.env.PORT!, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`Server running on ${url}`);
        } catch (err) {

    console.error(err);

  }
}
bootstrap();
