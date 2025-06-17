import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/auth.interface';

@Controller('/api/products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
    ) {}

    @Post('/new')
    @UseGuards(JwtAuthGuard)
    public async create(
        @Body() request: CreateProductRequest,
        @CurrentUser() user: TokenPayload,
    ) {
        return this.productService.createNewProduct(request, user.userId);
    }

    @Get('/')
    @UseGuards(JwtAuthGuard)
    public async getProducts(
        @CurrentUser() user: TokenPayload,
    ) {
        return this.productService.getProducts(user.userId);
    }
}
