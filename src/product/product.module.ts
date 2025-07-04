import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductGateway } from './product.gateway';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductGateway],
  exports: [ProductService],
})
export class ProductModule {}
