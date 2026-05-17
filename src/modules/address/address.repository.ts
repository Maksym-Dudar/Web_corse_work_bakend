import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class AddressRepository {
  constructor(private prisma: PrismaService) {}

  async create(address: Prisma.AddressCreateInput) {
    return this.prisma.address.create({
      data: address,
    });
  }
  async update(id: number, address: Prisma.AddressCreateInput) {
    return this.prisma.address.update({
      where: { id },
      data: address,
    });
  }

  async findAllUserAddress(id: number) {
    return this.prisma.address.findMany({
      where: { userId: id },
    });
  }
}
