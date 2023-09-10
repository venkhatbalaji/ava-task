// user.repository.ts
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}
