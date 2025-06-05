import { Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
@Injectable()
export class UserService {

    public async create(request: CreateUserRequest) {
        return {
            name: request.name,
            email: request.email,
            password: request.password,
        };
    }
}
