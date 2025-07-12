import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from './checkout.service';
import Stripe from 'stripe';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { ProductService } from '../product/product.service';

describe('CheckoutService', () => {
  let service: CheckoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: Stripe,
          useValue: {
            checkout: {
              sessions: {
                create: jest.fn(),
                retrieve: jest.fn(),
              },
            },
            webhooks: {
              constructEvent: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const mockConfig = {
                STRIPE_SECRET_KEY: 'sk_test_1234567890',
                STRIPE_WEBHOOK_SECRET: 'whsec_1234567890',
              };
              return mockConfig[key];
            }),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getProduct: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Test Product',
              price: 1000,
              description: 'This is a test product',
              userId: 1,
              imageExists: false,
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
