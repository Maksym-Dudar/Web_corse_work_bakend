import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [PrismaService, UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
