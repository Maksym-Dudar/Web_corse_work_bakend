import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { OrderStatus } from "@prisma/client";
import { ProductRepository } from "../product/product.repository";

const toCents = (amount: number) => Math.round(amount * 100);

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async markAsPaid(id: number) {
    return this.orderRepo.update(id, { status: OrderStatus.CONFIRMED });
  }

  async markAsFailed(id: number) {
    return this.orderRepo.update(id, { status: OrderStatus.FAILED });
  }
  async create(
    total: number,
    subtotal: number,
    userId: number,
    shippingMethodId: number,

    items: { productId: number; quantity: number }[],
  ) {
    if (!items.length) {
      throw new BadRequestException("Order items are required");
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new BadRequestException("Item quantity must be greater than 0");
      }
    }

    const productIds = items.map((item) => item.productId);
    const products = await this.productRepo.findManyPriceCards(productIds);
    const shippingMethod =
      await this.orderRepo.findShippingMethod(shippingMethodId);
    if (!shippingMethod) {
      throw new BadRequestException("Shipping method not found");
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let realSubtotal = 0;
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(
          `Product with id ${item.productId} not found`,
        );
      }
      if (item.quantity > product.quantityWarehouse) {
        throw new BadRequestException(
          `Product with id ${item.productId} does not have enough stock`,
        );
      }
      realSubtotal +=
        Number(product.price) * item.quantity * (1 - Number(product.sale));
    }

    const realTotal =
      realSubtotal +
      realSubtotal * Number(shippingMethod.percent) +
      Number(shippingMethod.fixedFee);

    if (toCents(subtotal) !== toCents(realSubtotal)) {
      throw new BadRequestException("Incorrect subtotal count");
    }

    if (toCents(total) !== toCents(realTotal)) {
      throw new BadRequestException("Incorrect total count");
    }
    return this.orderRepo.create(
      OrderStatus.PENDING,
      realTotal,
      subtotal,
      userId,
      shippingMethodId,
      items,
    );
  }

  async find(id: number, userId?: number) {
    const data = await this.orderRepo.findOneForCheckout(id, userId);

    if (!data) {
      throw new BadRequestException("Order not found");
    }

    const orderItem = data.orderItem?.map(({ product, quantity }) => ({
      id: product.id,
      color: product.color,
      title: product.productGroup?.title ?? null,
      price: product.price,
      quantity,
      image: buildImageUrl(product.image?.[0]) ?? buildImageUrl(product.image?.[1]) ?? null,
    }));

    return {
      id: data.id,
      total: data.total,
      subtotal: data.subtotal,
      shippingMethod: data.shippingMethod,
      orderItem,
    };
  }

  async findAllForUser(id: number) {
    return this.orderRepo.findManyForUser(id);
  }

  async findComplete(id: number, userId?: number) {
    const data = await this.orderRepo.findOneForComplete(id, userId);

    if (!data) {
      throw new BadRequestException("Order not found");
    }

    const orderItem = data.orderItem?.map(({ product, quantity }) => ({
      quantity,
      image: product.image?.[1] ?? product.image?.[0] ?? null,
    }));

    return {
      id: data.id,
      total: data.total,
      shippingMethod: data.shippingMethod,
      createdAt: data.createdAt,
      orderItem,
    };
  }

  async findAllShippingMethods() {
    return this.orderRepo.findAllShippingMethods();
  }

  async createShippingMethod(data: {
    percent: number;
    fixedFee: number;
    method: string;
    label: string;
  }) {
    return this.orderRepo.createShippingMethod(data);
  }
}
