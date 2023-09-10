// user.dto.ts
export class CreateProductDto {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stockQuantity: number;
}

export class UpdateProductDto {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stockQuantity: number;
}
