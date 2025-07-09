### Stripe Documentation

#### Stripe webhooks
1. Setup stripe CLI
```sh
brew install stripe/stripe-cli/stripe
```
```sh
stripe login
```
```sh
stripe listen --forward-to http://localhost:3001/api/checkout/webhook
```
2. Go to stripe dashboard (check)
```sh
Stripe website > Dashboard > Developers > Webhooks
```

3. Create webhook service & controller
*dto/create-session.request.ts*
```js
export class CreateSessionRequest {
    @IsNumber()
    productId: number;
}
```
*checkout.controller.ts*
```js
@Controller('/api/checkout')
export class CheckoutController {
    constructor(
        private readonly checkoutService: CheckoutService
    ) {}

    @Post('/session')
    @UseGuards(JwtAuthGuard)
    public async checkoutSession(
        @Body() request: CreateSessionRequest,
    ) {
        return this.checkoutService.createCheckoutSession(request.productId);
    }

    @Post('/webhook')
    public async checkoutWebhook(
        @Body() event: any,
    ) {
        return this.checkoutService.handleCheckoutWebhook(event);
    }
}
```
*checkout.service.ts*
```js
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
                }
            ],
            mode: 'payment',
            success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL') as string,
            cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL') as string,
        });
    }

    public async handleCheckoutWebhook(event: any) {
        this.logger.log(`Handling checkout webhook event`);

        if (event.type !== 'checkout.session.completed') {
            return;
        }

        const session = await this.stripe.checkout.sessions.retrieve(event.data.object.id);
        
        if (!session.metadata || !session.metadata.productId) {
            this.logger.error('No product ID found in session metadata');
            return;
        }
        await this.productService.updateProduct(
            parseInt(session.metadata.productId),
            { sold: true }
        );
    }
}
```