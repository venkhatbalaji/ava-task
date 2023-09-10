import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OrderModule } from './order.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const configService = app.get(ConfigService);
  const env = configService.get<string>('ENV');
  if (env === 'DEV') {
    const config = new DocumentBuilder()
      .setTitle('Order Service')
      .setDescription(
        'Order Service takes care of all the order related functionalities',
      )
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(configService.get<number>('PORT') || 8001);
}
bootstrap();
