import { IsString, IsNumber, IsEmail } from 'class-validator';

export class CreateAddressDto {
	@IsString()
	name!: string;

	@IsString()
	phoneNumber!: string;

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
