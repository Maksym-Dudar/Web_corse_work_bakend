import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller.js";
import { ProductRepository } from "./product.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import { PrismaModule } from "@/database/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [PrismaService, ProductService, ProductRepository],
})
export class ProductModule {}
