import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import type { FastifyRequest } from 'fastify'


@Injectable()
export class JwtVerifyGuard extends AuthGuard('jwt-verify') {
    public override getRequest(context: ExecutionContext): FastifyRequest {
        if (context.getType<GqlContextType>() === 'graphql') {
            const ctx = GqlExecutionContext.create(context).getContext<{ req: FastifyRequest }>()
            return ctx.req
        }

        return context.switchToHttp().getRequest<FastifyRequest>()
    }
}