import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('cert.key'),
    cert: fs.readFileSync('cert.crt'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
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

  // app.use((req, res, next) => {
  //   if (!req.secure) {
  //     return res.redirect('https://' + req.headers.host + req.url);
  //   }
  //   next();
  // });

  app.use(cookieParser());

  app.use('/webhook/stripe', express.raw({ type: 'application/json' }));

  await app.listen(process.env.PORT!, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`Server running on ${url}`);
}
bootstrap();
