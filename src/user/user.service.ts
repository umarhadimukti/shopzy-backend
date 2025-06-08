import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly logger: Logger,
        private readonly prismaService: PrismaService,
    ) {}

    public async create(request: CreateUserRequest): Promise<{ name: string, email: string }> {
        this.logger.log(`creating user ${request.name}..`);

        try {
            return await this.prismaService.user.create({
                data: {
                    ...request,
                    password: await bcrypt.hash(request.password, 10),
                },
                select: {
                    name: true,
                    email: true,
                },
            });
        } catch (error) {
            console.error(error)
            if (error.code === 'P2002') {
                throw new UnprocessableEntityException('email already exists');
            }
            throw error;
        }
    }

    public async getUser(filter: Prisma.UserWhereUniqueInput) {
        return this.prismaService.user.findUniqueOrThrow({
            where: filter,
        });
    }
}
