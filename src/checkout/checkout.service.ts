import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import Stripe from 'stripe';
import { ProductService } from 'src/product/product.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly logger: Logger,
    private readonly stripe: Stripe,
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {}

  public async createCheckoutSession(productId: number) {
    this.logger.log(`Create checkout session with product ID: ${productId}`);

    const product = await this.productService.getProduct(productId);
    return this.stripe.checkout.sessions.create({
      metadata: {
        productId,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(product.price.toNumber() * 100),
            product_data: {
              name: product.name,
              description: product.description ?? '',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
    });
  }

  public async handleCheckoutWebhook(event: any) {
    this.logger.log(`Handling checkout webhook event`);

    if (event.type !== 'checkout.session.completed') {
      return;
    }

    const session = await this.stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );

    if (!session.metadata || !session.metadata.productId) {
      this.logger.error('No product ID found in session metadata');
      return;
    }
    await this.productService.updateProduct(
      parseInt(session.metadata.productId),
      { sold: true },
    );
  }
}
