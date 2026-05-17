import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyShopCards(params: {
    skip: number;
    take: number;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }) {
    return await this.prisma.product.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy ? [params.orderBy] : undefined,
      select: {
        id: true,
        price: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
        productGroup: { select: { title: true } },
      },
    });
  }
  async findManyPriseCards(ids: number[]) {
    return await this.prisma.product.findMany({
      select: {
        id: true,
        price: true,
        sale: true,
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findManyGroup() {
    return await this.prisma.productGroup.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  async findManyCartCards(ids: number[]) {
    return await this.prisma.product.findMany({
      select: {
        id: true,
        price: true,
        color: true,
        image: true,
        sale: true,
        productGroup: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findManyWishlistCards(ids: number[]) {
    return await this.prisma.product.findMany({
      select: {
        id: true,
        color: true,
        price: true,
        image: true,
        productGroup: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async createProductGroup(title: string) {
    return this.prisma.productGroup.create({
      data: { title },
    });
  }

  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async updateProduct(id: number, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
  async findDetail(id: number) {
    return await this.prisma.product.findFirst({
      where: { id },
      select: {
        id: true,
        price: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
        productGroup: {
          select: {
            title: true,
            product: {
              select: {
                image: true,
                id: true,
                color: true,
                quantityWarehouse: true,
              },
            },
          },
        },
        offerExpires: true,
        reviews: true,
        description: true,
        category: true,
        color: true,
        measurements: true,
      },
    });
  }
}
