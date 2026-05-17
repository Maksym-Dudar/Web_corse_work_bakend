import { StripeService } from '@/integrations/stripe/stripe.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderService } from '../order/order.service';

@Injectable()
export class PaymentService {
  constructor(
    private stripeService: StripeService,
    private orderService: OrderService,
  ) {}
  async createIntent(orderId: number) {
    const order = await this.orderService.find(orderId);
    if (!order || !order?.total || !order?.id) {
      throw new NotFoundException('Order not fount');
    }
    return this.stripeService.createPaymentIntent({
      amount: 200,
      currency: 'usd',
      metadata: {
        orderId: 1,
      },
    });
  }
}
