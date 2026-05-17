import { IsArray, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FindManyWishlistDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) => value?.split(',').map(Number))
  ids!: number[];
}
