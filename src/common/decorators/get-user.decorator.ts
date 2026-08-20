import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserPayload {
  sub: string;
  email: string;
  rol: string;
  [key: string]: any;
}

interface RequestWithUser {
  user?: UserPayload;
}

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      return undefined;
    }
    if (data) {
      return user[data];
    }
    return user;
  },
);
