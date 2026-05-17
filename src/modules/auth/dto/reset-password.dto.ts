import { Type } from 'class-transformer';
import { IsEmail, IsNumberString, IsString, MinLength } from 'class-validator';

export class ResetPasswordOtpDto {
  @IsString()
  @MinLength(8)
  password!: string;

  @IsNumberString()
  @Type(() => Number)
  otp!: string;

  @IsEmail()
  email!: string;
}
