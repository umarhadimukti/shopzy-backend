import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.request';

@Controller('/api/users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post('/new')
    public async create(
        @Body() request: CreateUserRequest,
    ) {
        return this.userService.create(request);
    }
}
