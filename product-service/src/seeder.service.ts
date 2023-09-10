import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async seed() {
    try {
      // Seed Users
      const user1 = this.userRepository.create({
        username: 'user1',
        email: 'user1@example.com',
        password: 'hashed_password1',
      });
      const savedUser1 = await this.userRepository.save(user1);

      const user2 = this.userRepository.create({
        username: 'user2',
        email: 'user2@example.com',
        password: 'hashed_password2',
      });
      const savedUser2 = await this.userRepository.save(user2);

      // Seed Products
      const product1 = this.productRepository.create({
        name: 'Product 1',
        description: 'Description for Product 1',
        price: 19.99,
        stock_quantity: 100,
      });
      const savedProduct1 = await this.productRepository.save(product1);

      const product2 = this.productRepository.create({
        name: 'Product 2',
        description: 'Description for Product 2',
        price: 29.99,
        stock_quantity: 50,
      });
      const savedProduct2 = await this.productRepository.save(product2);

      // Seed Orders (with Many-to-Many relationship)
      const order1 = this.orderRepository.create({
        user: savedUser1,
        status: 'pending',
        products: [savedProduct1, savedProduct2],
      });
      await this.orderRepository.save(order1);

      const order2 = this.orderRepository.create({
        user: savedUser2,
        status: 'shipped',
        products: [savedProduct1],
      });
      await this.orderRepository.save(order2);

      Logger.log('Database seeding complete.');
    } catch (error) {
      Logger.error('Error seeding database: ' + error.message);
    }
  }
}
