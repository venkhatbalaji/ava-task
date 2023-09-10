import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from './config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { SeederService } from './seeder.service';
import { ConfigService } from '@nestjs/config';
import { OrderRepository } from './order.repository';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('HOST'),
        port: +configService.get('POS_PORT'),
        username: 'postgres',
        password: configService.get('PASSWORD'),
        entities: ['dist/*.entity.js'],
        synchronize: true,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      OrderRepository,
      UserRepository,
      User,
      Order,
      Product,
    ]),
    KafkaModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, SeederService],
})
export class OrderModule {
  constructor(private readonly seederService: SeederService) {}
  async onModuleInit() {
    await this.seederService.seed();
  }
}
