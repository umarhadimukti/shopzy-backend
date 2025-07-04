import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.request';
import { Prisma, Product } from '@prisma/client';
import { Decimal } from 'decimal.js';
import fs from 'fs/promises';
import { join } from 'path';
import { NotFoundException } from '@nestjs/common';
import { ProductResponse } from './product.interface';
import { ProductGateway } from './product.gateway';

@Injectable()
export class ProductService {
    constructor(
        private readonly logger: Logger,
        private readonly prismaService: PrismaService,
        private readonly productGateway: ProductGateway,
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
            this.productGateway.handleProductUpdated();
            return createdProduct;
        } catch (error) {
            this.logger.error(`Failed to create new product: ${error}`);
            console.error(error);
            throw error;
        }
    }

    public async getProducts(status?: string): Promise<Product[]> {
        const args: Prisma.ProductFindManyArgs = {};

        if (status === 'available') {
            args.where = { sold: false };
        }

        const products = await this.prismaService.product.findMany(args);

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
                join(__dirname, '../../', `public/images/products/${productId}.jpg`),
                fs.constants.F_OK,
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    public async getProduct(productId: number): Promise<ProductResponse> {
        try {
            return {
                ...( await this.prismaService.product.findUniqueOrThrow({ where: { id: productId } })),
                imageExists: await this.imageExists(productId),
            }
        } catch (error) {
            throw new NotFoundException(`Product not found with ID: ${productId}`);
        }
    }

    public async updateProduct(productId: number, request: Prisma.ProductUpdateInput): Promise<Product> {
        this.logger.log(`Updating product with ID: ${productId}`);

        try {
            const updatedProduct = await this.prismaService.product.update({
                where: { id: productId },
                data: request,
            });
            this.productGateway.handleProductUpdated();

            return updatedProduct;
        } catch (error) {
            this.logger.error(`Failed to update product with ID ${productId}: ${error}`);
            throw error;
        }
    }
    
}
