import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createPaymentIntent(amount: number) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // paisa/cents
      currency: 'pkr',
      automatic_payment_methods: { enabled: true },
    });
  }
}