import { IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsStrongPassword()
  password: string;
}
