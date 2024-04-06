import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.use(helmet());
  dotenv.config();
  app.setGlobalPrefix('api');

  // Log each request
  app.use((req, res, next) => {
    logger.log(`Request: ${req.method} ${req.originalUrl} `);
    res.on('finish', () => {
      logger.log(
        `Response:  ${req.method} ${req.originalUrl} ${res.statusCode}`,
      );
    });
    next();
  });

  (app as any).set('etag', false);

  const config = new DocumentBuilder()
    .setTitle('NEST FYP BACKEND')
    .setDescription('SYNCFLOW RECRUITMENT SYSTEM API')
    .setVersion('V-1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(5000);
}
bootstrap();
