import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/database/prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    MailModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: 604800 },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
