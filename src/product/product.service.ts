import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';
import { Product } from '@prisma/client';
import { Decimal } from 'decimal.js';
import fs from 'fs/promises';
import { join } from 'path';

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
            const price = new Decimal(request.price);
            const createdProduct = await this.prismaService.product.create({
                data: {
                    ...request,
                    price,
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

    public async getProducts(): Promise<Product[]> {
        const products = await this.prismaService.product.findMany();

        return Promise.all(
            products.map(async (product) => ({
                ...product,
                imageExists: await this.imageExists(product.id),
            })),
        );
    }

    private async imageExists(productId: number): Promise<boolean> {
        try {
            await fs.access(
                join(__dirname, '../../', `public/products/${productId}.jpg`),
                fs.constants.F_OK,
            );
            return true;
        } catch (error) {
            return false;
        }
    }
    
}
