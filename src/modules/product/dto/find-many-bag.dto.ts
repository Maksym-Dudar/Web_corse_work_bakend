import { IsArray, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindManyBagDto {
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  ids!: number[];
}
