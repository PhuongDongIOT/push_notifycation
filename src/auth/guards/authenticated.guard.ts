import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'
import type { FastifyRequest } from 'fastify'
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler())
    if (isPublic) return true

    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-mobicam-token'];

    if (token) {
      try {
        const payload = await this.jwtService.decode(token);
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['userId'] = payload?.id;

        return true
      } catch {
        throw new UnauthorizedException()
      }
    }
    return false
  }

  public getRequest(context: ExecutionContext): FastifyRequest {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext<{ req: FastifyRequest }>()
      return ctx.req
    }

    return context.switchToHttp().getRequest<FastifyRequest>()
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}