import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];

  app.enableCors({
    origin: allowedOrigins,
  });

  await app.listen(3000);
}
bootstrap();
