import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.request';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/auth.interface';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/new')
  @UseInterceptors(NoFilesInterceptor())
  public async create(@Body() request: CreateUserRequest) {
    return this.userService.create(request);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  public async getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }
}
