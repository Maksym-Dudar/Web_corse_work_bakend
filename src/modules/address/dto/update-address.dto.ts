import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { CreateAddressDto } from "./create-address.dto";

export class UpdateAddressDto extends CreateAddressDto {
  @IsNumber()
  @Type(() => Number)
  id!: number;
}
