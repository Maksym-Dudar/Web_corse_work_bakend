import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateIntent {
  @IsNumber()
  @Type(() => Number)
  orderId!: number;
}
