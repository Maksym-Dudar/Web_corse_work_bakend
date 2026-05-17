import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as otpGenerator from 'otp-generator';
import { MailService } from '../mail/mail.service';
import { AccessTokenPayload } from './types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userRepo.findByEmailAllData(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };

    return await this.jwtService.signAsync(payload);
  }

  async signUp(email: string, password: string, firstName: string) {
    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepo.create(email, hashedPassword, firstName);

    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };

    return await this.jwtService.signAsync(payload);
  }

  async generateOtp(email: string) {
    const otp = otpGenerator.generate(length, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const user = this.userRepo.update(email, {
      otp,
      expireOtp: new Date(Date.now() + 604800),
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    await this.mailService.sendVerification(email, otp);
    return;
  }

  async resetPasswordOtp(email: string, password: string, otp: string) {
    const user = await this.userRepo.findByEmailAllData(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.expireOtp || user.expireOtp < new Date(Date.now())) {
      throw new BadRequestException('Otp code is not changed');
    }
    if (user.otp != otp) {
      throw new BadRequestException('Otp code incorrect');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepo.update(email, {
      password: hashedPassword,
    });
  }

  async verifyToken(token: string) {
    const payload = this.jwtService.verify<AccessTokenPayload>(token);
    if (!payload) {
      throw new UnauthorizedException('Unauthorized user');
    }
    const user = await this.userRepo.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async changePassword(email, oldPassword, newPassword) {
    const user = await this.userRepo.findByEmailAllData(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const hashedOldPassword = await bcrypt.hash(oldPassword, 10);
    if (user.password != hashedOldPassword) {
      throw new BadRequestException('Incorrect password');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    return this.userRepo.update(email, {
      password: hashedNewPassword,
    });
  }
}
