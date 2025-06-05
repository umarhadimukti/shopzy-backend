import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    public async create(request: CreateUserRequest) {
        this.logger.warn('ini testing');
        return {
            name: request.name,
            email: request.email,
            password: request.password,
        };
    }
}
