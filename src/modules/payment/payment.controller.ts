import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateIntent } from './dto/create-intent.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createIntent(@Body() body: CreateIntent) {
    console.log(body, 'tut');
    console.log('work2');
    const paymentIntent = await this.paymentService.createIntent(body.orderId);
    console.log(paymentIntent);

    return { clientSecret: paymentIntent.client_secret };
  }
}
