import { UserDocument } from './../entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const { userId, ...rest } = req.user;
  return { _id: userId, ...rest } as Partial<UserDocument>;
});
