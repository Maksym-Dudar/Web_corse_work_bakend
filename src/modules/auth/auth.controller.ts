import {
  Controller,
  Post,
  Body,
  Delete,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import express from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { GenerateOtpDto } from './dto/otp.dto';
import { ResetPasswordOtpDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signUp(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const token = await this.authService.signIn(dto.email, dto.password);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 604800,
    });

    return { success: true };
  }

  @Post('sign-up')
  async signIn(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    console.log('gooo');
    console.log(process.env.JWT_SECRET);
    const token = await this.authService.signUp(
      dto.email,
      dto.password,
      dto.firstName,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 604800,
    });

    return { success: true };
  }

  @Post('otp-code')
  async generateOtp(@Body() dto: GenerateOtpDto) {
    return this.authService.generateOtp(dto.email);
  }

  @Post('reset-password')
  async resetPasswordOtp(@Body() dto: ResetPasswordOtpDto) {
    return this.authService.resetPasswordOtp(dto.email, dto.password, dto.otp);
  }

  @Delete('log-out')
  async logOut(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { success: true };
  }

  @Get('verify-jwt')
  async verifyJWT(@Req() req: express.Request) {
    const token = req.cookies('access_token');
    const isValid = this.authService.verifyToken(token);
    if (!isValid) throw new UnauthorizedException('User not authorized');
    console.log(isValid);
    return { success: true };
  }
}
