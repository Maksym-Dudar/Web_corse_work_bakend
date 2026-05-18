import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class AddressRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Prisma.AddressCreateInput) {
    return this.prisma.address.create({
      data: address,
    });
  }
  async update(id: number, userId: number, address: Prisma.AddressUpdateInput) {
    const result = await this.prisma.address.updateMany({
      where: { id, userId },
      data: address,
    });

    if (result.count === 0) {
      return null;
    }

    return this.prisma.address.findUnique({
      where: { id },
    });
  }

  async findAllUserAddress(id: number) {
    return this.prisma.address.findMany({
      where: { userId: id },
    });
  }
}
