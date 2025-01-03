import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createDocument } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    // origin: configService.get('ALLOWED_DOMAIN'),
    origin: '*',
    allowedHeaders:
      'Origin, Content-Type, Accept, Observe, Authorization, Request-From, Device-Id, X-Requested-With, X-HTTP-Method-Override',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  SwaggerModule.setup('api', app, createDocument(app));

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
