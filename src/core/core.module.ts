import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
// import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AuthenticatedGuard } from '@/auth'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    // { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_GUARD, useClass: AuthenticatedGuard },
  ],
})
export class CoreModule { }