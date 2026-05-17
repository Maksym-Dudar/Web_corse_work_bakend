import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller.js';
import { PrismaService } from '@/database/prisma/prisma.service';
import { OrderRepository } from './order.repository';
import { ProductRepository } from '../product/product.repository';

@Module({
  controllers: [OrderController],
  providers: [PrismaService, OrderService, OrderRepository, ProductRepository],
  exports: [OrderService],
})
export class OrderModule {}
