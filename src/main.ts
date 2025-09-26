import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import corsConfig from './configs/cors.config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/exception-filter';

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

  app.useGlobalFilters(new AllExceptionsFilter());

  const apiPrefix = process.env.API_PREFIX ?? '/api/v1';
  app.setGlobalPrefix(apiPrefix.replace(/^\/+/, ''));
  app.enableCors(corsConfig());
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Card Link API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (!document.components) {
    document.components = {};
  }
  document.components.securitySchemes = {
    'JWT-auth': {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    access_token: {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
    },
  };

  // Apply global security to all endpoints by default
  document.security = [
    {
      'JWT-auth': [],
    },
  ];
  SwaggerModule.setup(`${apiPrefix}/docs`.replace(/\/+/, '/'), app, document);

  await app.listen(process.env.PORT ?? 8000);
}
void bootstrap();
