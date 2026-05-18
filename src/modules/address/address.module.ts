import { Module } from "@nestjs/common";
import { AddressService } from "./address.service";
import { AddressController } from "./address.controller.js";
import { AddressRepository } from "./address.repository";
import { PrismaService } from "@/database/prisma/prisma.service";

@Module({
  controllers: [AddressController],
  providers: [PrismaService, AddressRepository, AddressService],
})
export class AddressModule {}
