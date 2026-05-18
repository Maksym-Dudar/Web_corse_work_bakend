import { Type } from "class-transformer";
import { IsNumber, ValidateNested, IsArray } from "class-validator";

class OrderItem {
  @IsNumber()
  @Type(() => Number)
  productId!: number;

  @IsNumber()
  @Type(() => Number)
  quantity!: number;
}

export class CreateOrder {
  @IsNumber()
  @Type(() => Number)
  total!: number;

  @IsNumber()
  @Type(() => Number)
  subtotal!: number;

  @IsNumber()
  @Type(() => Number)
  shippingMethodId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items!: OrderItem[];
}
