import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from './user.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const configService = app.get(ConfigService);
  const env = configService.get<string>('ENV');
  if (env === 'DEV') {
    const config = new DocumentBuilder()
      .setTitle('User Service')
      .setDescription(
        'User Service takes care of all the user related functionalities',
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(configService.get<number>('PORT') || 8000);
}
bootstrap();
