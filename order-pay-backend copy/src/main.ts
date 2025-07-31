import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Dynamic CORS configuration for different environments
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : process.env.NODE_ENV === 'production'
    ? [] // Will be set by CORS_ORIGINS in production
    : ['http://localhost:3000', 'http://localhost:3001']; // Default for development

  app.enableCors({
    origin: true, //TODO: Update to corsOrigins for prod
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on port ${port}`);
  console.log(`🌐 CORS origins: ${corsOrigins}`);
}
bootstrap();
