import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(
        private readonly logger: Logger,
        private readonly prismaService: PrismaService,
    ) {}

    public async createNewProduct(
        request: CreateProductRequest,
        userId: number,
    ): Promise<Product> {
        this.logger.log('Creating new product..');

        try {
            const createdProduct = await this.prismaService.product.create({
                data: {
                    ...request,
                    userId,
                },
            });
            return createdProduct;
        } catch (error) {
            this.logger.error(`Failed to create new product: ${error}`);
            console.error(error);
            throw error;
        }
    }
}
