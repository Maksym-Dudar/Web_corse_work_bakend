import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    status: OrderStatus,
    total: number,
    subtotal: number,
    userId: number,
    shippingMethodId: number,
    item: { productId: number; quantity: number }[],
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          status,
          total,
          subtotal,
          userId,
          shippingMethodId,
        } as Prisma.OrderUncheckedCreateInput,
      });

      const orderItem = item.map((val) => ({ ...val, orderId: order.id }));
      await tx.orderItem.createMany({
        data: orderItem,
      });
      return order;
    });
  }

  async update(id: number, order: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({ where: { id }, data: order });
  }

  async findOneForCheckout(id: number, userId?: number) {
    return this.prisma.order.findFirst({
      where: { id, ...(userId ? { userId } : {}) },
      select: {
        total: true,
        shippingMethod: true,
        subtotal: true,
        id: true,
        orderItem: {
          select: {
            product: {
              select: {
                id: true,
                image: true,
                color: true,
                price: true,
                productGroup: {
                  select: {
                    title: true,
                  },
                },
              },
            },
            quantity: true,
          },
        },
      },
    });
  }

  async findOneForComplete(id: number, userId?: number) {
    return this.prisma.order.findFirst({
      where: { id, ...(userId ? { userId } : {}) },
      select: {
        total: true,
        shippingMethod: true,
        id: true,
        createdAt: true,
        orderItem: {
          select: {
            product: {
              select: {
                image: true,
              },
            },
            quantity: true,
          },
        },
      },
    });
  }

  async findManyForUser(id: number) {
    return this.prisma.order.findMany({ where: { userId: id } });
  }

  async createShippingMethod(shippingMethod: Prisma.ShippingMethodCreateInput) {
    return this.prisma.shippingMethod.create({ data: shippingMethod });
  }

  async findAllShippingMethods() {
    return this.prisma.shippingMethod.findMany();
  }

  async findShippingMethod(id: number) {
    return this.prisma.shippingMethod.findFirst({ where: { id } });
  }
}
