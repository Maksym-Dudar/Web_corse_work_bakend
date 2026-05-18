import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";

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

    await app.listen(process.env.PORT ?? 3000, "0.0.0.0");

    const url = await app.getUrl();
    console.log(`Server running on ${url}`);
  } catch (err) {
    console.error(err);
  }
}
void bootstrap();
