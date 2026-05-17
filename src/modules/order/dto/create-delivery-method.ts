import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateDeliveryMethod {
  @IsNumber()
  @Type(() => Number)
  percent!: number;

  @IsNumber()
  @Type(() => Number)
  fixedFee!: number;

  @IsString()
  method!: string;

  @IsString()
  label!: string;
}
