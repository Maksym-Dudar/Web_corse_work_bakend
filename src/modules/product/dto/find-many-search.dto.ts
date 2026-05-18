import { IsOptional, IsString } from "class-validator";

export class FindManySearchDto {
  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsString()
  world?: string;
}
