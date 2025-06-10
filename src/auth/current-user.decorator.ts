import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './auth.interface';

const getCurrentUserByContext = (context: ExecutionContext): TokenPayload => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator =
  createParamDecorator(
    (_data: unknown, context: ExecutionContext): TokenPayload =>
      getCurrentUserByContext(context),
  );
