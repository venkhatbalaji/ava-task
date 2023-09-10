import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConfigModule } from './config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { SeederService } from './seeder.service';
import { ConfigService } from '@nestjs/config';
import { ProductRepository } from './product.repository';
import { DataSource } from 'typeorm';

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
    TypeOrmModule.forFeature([ProductRepository, User, Order, Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService, SeederService],
})
export class UserModule {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    await this.seederService.seed();
  }
}
