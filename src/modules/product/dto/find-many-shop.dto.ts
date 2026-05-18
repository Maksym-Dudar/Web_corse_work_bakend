import { IsOptional, IsEnum, IsNumber, IsArray, IsInt } from "class-validator";
import { Type, Transform } from "class-transformer";
import { Category } from "@prisma/client";
import { Sorts } from "@/common/enums/sorts.enum";

export class FindManyShopDto {
  @IsNumber()
  @Type(() => Number)
  take!: number;

  @IsOptional()
  @IsEnum([...Object.values(Category), "ALL"])
  category?: Category | "ALL";

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsEnum(Sorts)
  sort?: Sorts;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map(Number)
      : String(value).split(",").filter(Boolean).map(Number),
  )
  groupId?: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}
