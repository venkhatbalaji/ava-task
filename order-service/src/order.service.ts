import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { ProductRepository } from './product.repository';
import { UserRepository } from './user.repository';
import { Product } from './product.entity';
import { User } from './user.entity';
import { In } from 'typeorm';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly kafkaProducerService: ProducerService,
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['user', 'products'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: ['user', 'products'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = new Order();
    if (!createOrderDto.userId) {
      throw new NotFoundException(`User ID not found`);
    }
    const user = await this.userRepository.findOne({
      where: { user_id: createOrderDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ${createOrderDto.userId} not found`,
      );
    }
    const product = await this.productRepository.findBy({
      product_id: In(createOrderDto.products),
    });
    if (!product) {
      throw new NotFoundException(
        `Products with ${createOrderDto.products} not found`,
      );
    }
    newOrder.order_date = new Date();
    newOrder.user = user;
    newOrder.products = product;
    newOrder.status = 'Order Placed';
    const order = this.orderRepository.create(newOrder);
    // Send a Kafka message with the order data
    await this.kafkaProducerService.produce({
      topic: 'order-placed',
      messages: [{ value: Buffer.from(JSON.stringify(newOrder)) }],
    });
    return await this.orderRepository.save(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateOrderDto.status;
    await this.orderRepository.save(order);
    if (order.status === 'Order Shipped') {
      // Send a Kafka message with the order data
      await this.kafkaProducerService.produce({
        topic: 'order-shipped',
        messages: [{ value: JSON.stringify(order) }],
      });
    }
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    if (order.user) {
      order.user = null;
      await this.orderRepository.save(order);
    }
    await this.orderRepository.remove(order);
  }
}
