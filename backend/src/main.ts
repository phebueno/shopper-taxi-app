import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './common/filters/validation.filter';
config({ path: '../.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(validationPipeOptions),
  );
  
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
