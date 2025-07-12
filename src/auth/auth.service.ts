import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  public async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      const isAuthenticated = await bcrypt.compare(password, user.password);

      if (!isAuthenticated) {
        throw new UnauthorizedException();
      }

      return {
        id: user.id,
        email: user.email,
      };
    } catch (error: unknown) {
      this.logger.error(error);
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  public async verifyToken(jwt: string) {
    await this.jwtService.verify(jwt);
  }

  public login(user: User, response: Response) {
    const jwtExpiration = ms(this.configService.getOrThrow('JWT_EXPIRATION'));
    const expires = new Date(Date.now() + jwtExpiration);

    const tokenPayload: TokenPayload = { userId: user.id };
    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      httpOnly: true,
      expires,
      sameSite: 'lax',
    });

    return {
      status: true,
      message: 'login successful',
      tokenPayload,
    };
  }
}
