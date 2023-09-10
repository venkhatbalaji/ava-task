import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { User } from './user.entity';

// order.dto.ts
export class CreateOrderDto {
  @ApiProperty({
    type: Array<number>,
  })
  readonly products: number[];
  @ApiProperty({
    type: 'number',
  })
  readonly userId: number;
}

export class UpdateOrderDto {
  @ApiProperty({
    type: 'string',
  })
  readonly status: string;
}
