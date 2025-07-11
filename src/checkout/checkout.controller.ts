import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSessionRequest } from './dto/create-session.request';

@Controller('/api/checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('/session')
  @UseGuards(JwtAuthGuard)
  public async checkoutSession(@Body() request: CreateSessionRequest) {
    return this.checkoutService.createCheckoutSession(request.productId);
  }

  @Post('/webhook')
  public async checkoutWebhook(@Body() event: any) {
    return this.checkoutService.handleCheckoutWebhook(event);
  }
}
