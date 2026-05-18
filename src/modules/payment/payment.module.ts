import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { StripeModule } from "@/integrations/stripe/stripe.module";
import { PaymentWebhookController } from "./payment.webhook.controller";
import { OrderModule } from "../order/order.module";

@Module({
  controllers: [PaymentController, PaymentWebhookController],
  providers: [PaymentService],
  imports: [StripeModule, OrderModule],
})
export class PaymentModule {}
