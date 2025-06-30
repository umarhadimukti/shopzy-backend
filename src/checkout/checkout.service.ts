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
                }
            ],
            mode: 'payment',
            success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL') as string,
            cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL') as string,
        });
    }
}
