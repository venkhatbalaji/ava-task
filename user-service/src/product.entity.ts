import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  stock_quantity: number;

  // Define other product-related columns here.

  @ManyToMany(() => Order, (order) => order.products)
  orders: Order[];
}
