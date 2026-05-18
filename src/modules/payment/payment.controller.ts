import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreateIntent } from "./dto/create-intent.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.guard";
import { AccessTokenPayload } from "../auth/types";

@UseGuards(JwtAuthGuard)
@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-payment-intent")
  async createIntent(
    @Body() body: CreateIntent,
    @Req() req: Request & { user: AccessTokenPayload },
  ) {
    const paymentIntent = await this.paymentService.createIntent(
      body.orderId,
      req.user.sub,
    );

    return { clientSecret: paymentIntent.client_secret };
  }
}
