import { StripeService } from "@/integrations/stripe/stripe.service";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { OrderService } from "../order/order.service";

@Injectable()
export class PaymentService {
  constructor(
    private stripeService: StripeService,
    private orderService: OrderService,
  ) {}
  async createIntent(orderId: number, userId: number) {
    const order = await this.orderService.find(orderId, userId);
    if (!order || !order?.total || !order?.id) {
      throw new NotFoundException("Order not found");
    }
    const amount = Math.round(Number(order.total) * 100);
    if (amount <= 0) {
      throw new BadRequestException("Order total must be greater than 0");
    }
return this.stripeService.createPaymentIntent({
			amount: Number(order.total) * 100,
			currency: "usd",
			metadata: {
				orderId: order.id,
			},
		});
  }
}
