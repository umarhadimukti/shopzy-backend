import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import Stripe from 'stripe';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ConfigModule, ProductModule],
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY'));
      },
      inject: [ConfigService],
    }
  ],
})
export class CheckoutModule {}
