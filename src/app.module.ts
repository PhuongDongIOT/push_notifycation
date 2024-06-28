import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler'
import { env } from '@/config/config'

import * as MainModule from './modules'
import { DatabaseModule } from './core/database/database.module'
import { CronModule } from './schedules/cron.module';
// import { AuthModule } from './auth/auth.module';
// import { BaseModule } from './base/base.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        host: env.MYSQL_HOST,
        port: parseInt(env.MYSQL_PORT) ?? 3306,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    // AuthModule,
    // BaseModule,
    CoreModule,
    CronModule,
    ...Object.values(MainModule),
  ],
  providers: [],
})
export class AppModule { }
