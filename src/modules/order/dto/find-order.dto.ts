import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindOrderDto {
  @IsNumber()
  @Type(() => Number)
  orderId!: number;
}
