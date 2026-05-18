import {
  Controller,
  Post,
  Body,
  Delete,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import express from "express";
import type { CookieOptions } from "express";
import { SignInDto } from "./dto/sign-in.dto";
import { GenerateOtpDto } from "./dto/otp.dto";
import { ResetPasswordOtpDto } from "./dto/reset-password.dto";

const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const token = await this.authService.signIn(dto.email, dto.password);

    res.cookie("access_token", token, ACCESS_TOKEN_COOKIE_OPTIONS);

    return { success: true };
  }

  @Post("sign-up")
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const token = await this.authService.signUp(
      dto.email,
      dto.password,
      dto.firstName,
    );

    res.cookie("access_token", token, ACCESS_TOKEN_COOKIE_OPTIONS);

    return { success: true };
  }

  @Post("otp-code")
  async generateOtp(@Body() dto: GenerateOtpDto) {
    return this.authService.generateOtp(dto.email);
  }

  @Post("reset-password")
  async resetPasswordOtp(@Body() dto: ResetPasswordOtpDto) {
    return this.authService.resetPasswordOtp(dto.email, dto.password, dto.otp);
  }

  @Delete("log-out")
  logOut(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie("access_token", ACCESS_TOKEN_COOKIE_OPTIONS);
    return { success: true };
  }

  @Get("verify-jwt")
  async verifyJWT(@Req() req: express.Request) {
    const cookies = req.cookies as unknown as
      | Record<string, string>
      | undefined;
    const token = cookies?.access_token;
    if (!token) throw new UnauthorizedException("User not authorized");

    await this.authService.verifyToken(token);
    return { success: true };
  }
}
