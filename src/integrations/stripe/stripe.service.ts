import { TCurrency } from '@/common/types/patment.type';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
    });
  }

  async createPaymentIntent(data: {
    amount: number;
    currency: TCurrency;
    metadata?: Record<string, number>;
  }) {
    return this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      metadata: data.metadata,
    });
  }

  constructWebhookEvent(body: Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  }
}
