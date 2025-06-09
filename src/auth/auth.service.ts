import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
    ) {}

    public async verifyUser(email: string, password: string) {
        try {
            const user = await this.userService.getUser({ email });
            const isAuthenticated = await bcrypt.compare(password, user.password);

            if (!isAuthenticated) {
                throw new UnauthorizedException();
            }

            return {
                data: {
                    email: user.email,
                    name: user.name,
                }
            }
        } catch (error) {
            throw new UnauthorizedException('Credentials are not valid');
        }
    }

    public async login(user: User, response: Response) {
        
    }
}
