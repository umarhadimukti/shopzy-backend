import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.request';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/new')
  @UseInterceptors(NoFilesInterceptor())
  public async create(@Body() request: CreateUserRequest) {
    return this.userService.create(request);
  }
}
