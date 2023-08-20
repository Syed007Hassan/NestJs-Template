import { Injectable } from '@nestjs/common';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';

import Stripe from 'stripe';

import { Cart } from './entities/card.model';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  checkout(cart: Cart) {
    console.log(JSON.stringify(this.stripe) + 'this.stripe');

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const res = this.stripe.paymentIntents.create({
      amount: totalPrice * 100, // cents
      currency: 'usd', // set currency
      payment_method_types: ['card'], // set payment method
    });

    console.log(res + 'res');

    return res;
  }

  create(createStripeDto: CreateStripeDto) {
    return 'This action adds a new stripe';
  }

  findAll() {
    return `This action returns all stripe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  update(id: number, updateStripeDto: UpdateStripeDto) {
    return `This action updates a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }
}
