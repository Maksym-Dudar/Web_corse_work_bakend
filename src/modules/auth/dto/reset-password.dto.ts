import { IsEmail, IsNumberString, IsString, MinLength } from "class-validator";

export class ResetPasswordOtpDto {
  @IsString()
  @MinLength(8)
  password!: string;

  @IsNumberString()
  otp!: string;

  @IsEmail()
  email!: string;
}
