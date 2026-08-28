import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const corsOrigin = config.get<string>('CORS_ORIGIN', 'http://localhost:5173');
  app.enableCors({ origin: corsOrigin.split(',').map((o) => o.trim()) });

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Skill Graph API listening on port ${port}`);
}
bootstrap();
