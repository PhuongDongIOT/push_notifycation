import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { FastifyRequest } from 'fastify'

@Injectable()
export class LocalLoginGuard extends AuthGuard('local') implements CanActivate {
    public override async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = <boolean>await super.canActivate(context)
        const request: any = context.switchToHttp().getRequest<FastifyRequest>()
        await super.logIn(request)

        return result
    }
}