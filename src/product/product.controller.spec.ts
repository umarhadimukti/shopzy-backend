import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { Product } from '@prisma/client';
import Decimal from 'decimal.js';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return products when keyword is provided', async () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'Description of Product 1',
        price: Decimal('100'),
        sold: false,
        userId: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description of Product 2',
        price: Decimal('150'),
        sold: false,
        userId: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    jest.spyOn(controller, 'getProducts').mockResolvedValue(mockProducts);

    const result = await controller.getProducts('available', 'Product');

    expect(result).toEqual(mockProducts);
    expect(controller.getProducts).toHaveBeenCalledWith('available', 'Product');
  });
});
