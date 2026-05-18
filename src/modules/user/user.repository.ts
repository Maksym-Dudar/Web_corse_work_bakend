import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });
  }
  async findByEmailAllData(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  async create(email: string, password: string, firstName: string) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        firstName,
        createdAt: new Date(),
      },
      select: {
        id: true,
        email: true,
      },
    });
  }
  async update(
    email: string,
    prop: Omit<
      Prisma.UserUpdateInput,
      "email" | "updatedAt" | "createdAt" | "id"
    >,
  ) {
    return this.prisma.user.update({
      where: { email },
      data: {
        ...prop,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
    });
  }
}
