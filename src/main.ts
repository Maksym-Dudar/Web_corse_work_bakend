import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import * as express from 'express';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { rawBody: true });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableCors({
      origin: "https://web-corse-work-jjhb.vercel.app",
      credentials: true,
    });

    app.use(cookieParser());
    
    app.use('/public', express.static(join(process.cwd(), 'public')));

    app.use(
    '/webhook/stripe',
    bodyParser.raw({ type: 'application/json' }),

  );

  app.use(bodyParser.json());

    await app.listen(process.env.PORT ?? 3000, "0.0.0.0");

    const url = await app.getUrl();
    console.log(`Server running on ${url}`);
  } catch (err) {
    console.error(err);
  }
}
void bootstrap();
