import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './commom/filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Helmet for security protection
  app.use(helmet());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('FpayChain')
    .setDescription('API documentation for fpaychain')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'JWT-auth') // JWT auth setup in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Use global exception filters
  app.useGlobalFilters(new HttpExceptionFilter());

  const PORT = Number(process.env.PORT) || 5000;
  const nodeEnv = process.env.NODE_ENV || "development";
  
  console.log(`Starting server on port ${PORT} in ${nodeEnv} mode...`);

  await app.listen(PORT, () =>
    console.log(`Application running in ${nodeEnv} mode on port ${PORT}`)
  );
}

bootstrap();