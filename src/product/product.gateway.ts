import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductGateway {
  constructor(private readonly authService: AuthService) {}

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
