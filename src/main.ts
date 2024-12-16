import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'https://qairline-admin-frontend.vercel.app'], 
    methods: 'GET, POST, PATCH, DELETE', 
    allowedHeaders: 'Content-Type, Authorization',
  });
  // app.useGlobalInterceptors(new LoggingInterceptor());
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('The users API description')
    .addTag('auth', 'Authentication related endpoints')
    .addTag('users', 'User management endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your refresh token',
      },
      'refreshToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
