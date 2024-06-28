import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import type { FastifyRequest } from 'fastify'

export const ReqUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  let request: any;

  if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context).getContext<{ req: FastifyRequest }>();
    request = ctx.req;
  } else {
    request = context.switchToHttp().getRequest<FastifyRequest>();
  }

  return request.user;
});