### Websocket Documentation

#### 1. Installed packages
```sh
pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io
```

#### 2. Products Gateway
*product.gateway.ts*
```js
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ProductGateway {
    constructor(
        private readonly authService: AuthService,
    ) {}

    // This gateway can be used to handle real-time updates related to products.
    @WebSocketServer()
    private readonly server: Server;

    public handleProductUpdated() {
        this.server.emit('productUpdated');
    }

    public handleConnection(client: Socket) {
        try {
            this.authService.verifyToken(client.handshake.auth.Authentication?.value);
        } catch (error) {
            throw new WsException('Unauthorized');
        }
    }
}
```

#### 3. Update product services
```js
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
        this.productGateway.handleProductUpdated(); // write this code

        return createdProduct;
    } catch (error) {
        this.logger.error(`Failed to create new product: ${error}`);
        console.error(error);
        throw error;
    }
}

public async updateProduct(productId: number, request: Prisma.ProductUpdateInput): Promise<Product> {
    this.logger.log(`Updating product with ID: ${productId}`);

    try {
        const updatedProduct = await this.prismaService.product.update({
            where: { id: productId },
            data: request,
        });
        this.productGateway.handleProductUpdated(); // write this code

        return updatedProduct;
    } catch (error) {
        this.logger.error(`Failed to update product with ID ${productId}: ${error}`);
        throw error;
    }
}
```

#### 4. Update auth services
```js
public async verifyToken(jwt: string) {
    await this.jwtService.verify(jwt);
}
```