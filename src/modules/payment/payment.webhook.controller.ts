import { Controller, Post, Req, Headers, HttpCode } from "@nestjs/common";
import type { Request } from "express";
import { StripeService } from "@/integrations/stripe/stripe.service";
import { OrderService } from "@/modules/order/order.service";

type RawBodyRequest = Request & { rawBody?: Buffer };

@Controller("webhook")
export class PaymentWebhookController {
  constructor(
    private stripeService: StripeService,
    private orderService: OrderService,
  ) {}

  @Post("stripe")
  @HttpCode(200)
  async handleStripeWebhook(
    @Req() req: RawBodyRequest,
    @Headers("stripe-signature") signature: string,
  ) {
    const event = this.stripeService.constructWebhookEvent(
      req.rawBody ?? Buffer.from(JSON.stringify(req.body)),
      signature,
    );

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = +paymentIntent.metadata.orderId;

        await this.orderService.markAsPaid(orderId);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = +paymentIntent.metadata.orderId;

        await this.orderService.markAsFailed(orderId);
        break;
      }
    }
  }
}
