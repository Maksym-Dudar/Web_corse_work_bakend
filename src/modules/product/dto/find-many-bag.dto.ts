import { IsArray, IsInt } from "class-validator";
import { Transform } from "class-transformer";

export class FindManyBagDto {
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(Number)
      : String(value).split(",").filter(Boolean).map(Number),
  )
  ids!: number[];
}
