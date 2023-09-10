import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) {}

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const user = await this.productRepository.findOne({
      where: { product_id: id },
    });
    if (!user) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return user;
  }

  async create(createProductDto: CreateProductDto) {
    return await this.productRepository.save(createProductDto);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['orders'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    for (const order of product.orders) {
      order.user = null;
      await this.orderRepository.save(order);
    }
    await this.productRepository.remove(product);
  }
}
