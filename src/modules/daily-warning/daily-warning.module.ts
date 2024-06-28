import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { HttpModule } from '@nestjs/axios'

import { DailyWarningService } from './daily-warning.service'
import { DailyWarningController } from './daily-warning.controller'


@Module({
  imports: [
    CacheModule.register(),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DailyWarningController],
  providers: [DailyWarningService],
})
export class DailyWarningModule { }
