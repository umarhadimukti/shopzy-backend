import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';

@Injectable()
export class UserService {
    public async create(request: CreateUserRequest) {
        return {
            name: 'test',
            email: 'test@gmail.com',
            password: 'test1234',
        };
    }
}
