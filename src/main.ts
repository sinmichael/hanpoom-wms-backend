import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Warehouse Management System API')
    .setDescription('API for Hanpoom Warehouse Management System Backend')
    .setVersion('1.0')
    .setExternalDoc(
      'Hanpoom Warehouse Management System Backend API',
      'api/docs-json',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log('Hanpoom Warehouse Management System Backend');
  logger.log(`Listening on port ${port}`);
}
bootstrap();
