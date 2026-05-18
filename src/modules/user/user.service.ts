import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { AuthService } from "../auth/auth.service";
import { PatchUserDto } from "./dto/update-user.dto";
import * as fs from "fs/promises";
import * as path from "path";
import { DIRECTORY } from "@/configs/directory.config";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async findUser(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return user;
  }

  async patchUser(email: string, payload: PatchUserDto) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    if (payload.oldPassword || payload.newPassword) {
      if (!payload.oldPassword || !payload.newPassword) {
        throw new BadRequestException("Both passwords required");
      }

      await this.authService.changePassword(
        user.email,
        payload.oldPassword,
        payload.newPassword,
      );
    }
    const updateData: Partial<User> = {};

    if (payload.firstName) updateData.firstName = payload.firstName;
    if (payload.lastName) updateData.lastName = payload.lastName;
    return await this.userRepo.update(user.email, updateData);
  }

  async updateAvatar(email: string, file: Express.Multer.File) {
    if (!file || file.size === 0) {
      throw new BadRequestException("File not found");
    }
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException("Incorrect image format");
    }

    const uploadDir = path.join(process.cwd(), DIRECTORY.AVATAR);
    await fs.mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.originalname).toLowerCase();
    const safeExtension = extension.replace(/[^a-z0-9.]/gi, "");
    const fileName = `${email}${safeExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    return await this.userRepo.update(email, {
      avatar: `${DIRECTORY.AVATAR}/${fileName}`,
    });
  }
}
