import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger doc config
  const config = new DocumentBuilder()
    .setTitle('Chambitas Backend API')
    .setDescription('Documentación de Chambitas :)')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicación corriendo en: http://localhost:3000`);
  console.log(`Documentación Swagger en: http://localhost:3000/api/docs`);
}
bootstrap();