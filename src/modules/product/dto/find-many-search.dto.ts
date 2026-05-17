import { IsString } from 'class-validator';

export class FindManySearchDto {
  @IsString()
  world!: string;
}
