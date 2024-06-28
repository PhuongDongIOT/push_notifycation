import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { DailyWarningService } from '@/modules/daily-warning/daily-warning.service'
import { CronService } from './cron.service';
import { HttpCronService } from './http.cron.service'

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),],
  providers: [DailyWarningService, CronService, HttpCronService],
  exports: [CronService],
})
export class CronModule { }