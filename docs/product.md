### Product Documentation

#### 1. Installed packages (Image Upload)
```sh
pnpm add @nestjs/serve-static multer
pnpm add -D @types/multer
```

#### 2. Register serve static
*app.module.ts*
```js
ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../', 'public'),
}),
```

#### 3. Setup product controller
*product.controller.ts*
```js
@Post('/:productId/image')
@UseGuards(JwtAuthGuard)
@UseInterceptors(
    FileInterceptor('image', {
        storage: diskStorage({
            destination: 'public/images/products',
            filename: (req, file, callback) => {
                callback(null, `${req.params.productId}${extname(file.originalname)}`);
            },
        }),
    })
)

public async uploadProductImage(
    @UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 500000 }),
                new FileTypeValidator({ fileType: 'image/jpeg' }),
            ],
        })
    ) _file: Express.Multer.File
) {}
```

#### 4. Create new product interface
*product.interface.ts*
```js
import { Product } from "@prisma/client";

export interface ProductResponse extends Product {
    imageExists: boolean;
}
```

#### 5. Setup product service
```js
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
            join(__dirname, '../../', `public/images/products/${productId}.jpg`),
            fs.constants.F_OK,
        );
        return true;
    } catch (error) {
        return false;
    }
}
```