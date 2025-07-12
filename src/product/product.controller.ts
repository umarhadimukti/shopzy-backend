import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/auth.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('/api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.productService.getProducts(status, keyword);
  }

  @Post('/:productId/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images/products',
        filename: (req, file, callback) => {
          callback(
            null,
            `${req.params.productId}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  public async uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    _file: Express.Multer.File,
  ) {}

  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  public async getProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.getProduct(productId);
  }
}
