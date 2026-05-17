import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  title!: string;

  @IsNumber()
  @Type(() => Number)
  price!: number;

  @IsNumber()
  @Type(() => Number)
  sale!: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  offerExpires?: Date = new Date();

  @IsBoolean()
  @Type(() => Boolean)
  isNew!: boolean;

  @IsArray()
  @IsEnum(Category, { each: true, message: 'Category is incorrect' })
  @Type(() => String)
  category!: Category[];

  @IsString()
  color!: string;

  @IsString()
  description!: string;

  @IsString()
  measurements!: string;

  @IsNumber()
  @Type(() => Number)
  quantityWarehouse!: number;

  @IsNumber()
  @Type(() => Number)
  productGroupId!: number;
}
