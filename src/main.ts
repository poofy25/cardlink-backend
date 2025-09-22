import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import corsConfig from './configs/cors.config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const apiPrefix = process.env.API_PREFIX ?? '/api/v1';
  app.setGlobalPrefix(apiPrefix.replace(/^\/+/, ''));
  app.enableCors(corsConfig());
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Card Link API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`.replace(/\/+/, '/'), app, document);

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
