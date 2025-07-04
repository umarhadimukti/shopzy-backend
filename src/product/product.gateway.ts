import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ProductGateway {
    // This gateway can be used to handle real-time updates related to products.
    @WebSocketServer()
    private readonly server: Server;

    public handleProductUpdated() {
        this.server.emit('productUpdated');
    }
}