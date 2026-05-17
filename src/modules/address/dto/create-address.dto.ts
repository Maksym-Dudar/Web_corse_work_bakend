import { IsString, IsNumber, IsEmail } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  phoneNumber!: string;

  @IsEmail()
  email!: string;

  @IsString()
  country!: string;

  @IsString()
  state!: string;

  @IsString()
  city!: string;

  @IsString()
  street!: string;

  @IsString()
  buildingNumber!: string;

  @IsString()
  zipCode!: string;
}
