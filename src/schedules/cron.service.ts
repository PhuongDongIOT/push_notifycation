import { Injectable } from '@nestjs/common'
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

import { DailyWarningService } from '@/modules/daily-warning/daily-warning.service'
import { IDailyWarningsRes } from '@/modules/daily-warning/daily-warning.entity'
import { HttpCronService, } from './http.cron.service'
import { IItemPush } from './cron.entity'
import { checkIsArrayEmpty } from '@/utilities/array.utilities'

@Injectable()
export class CronService {
  constructor(private readonly dailyWarningService: DailyWarningService,
    private readonly httpCronService: HttpCronService
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async runEvery7amDailyWarning() {
    const dailyWarningRes: IDailyWarningsRes = await this.dailyWarningService.getDailyWarningToNotification()
    if (checkIsArrayEmpty(dailyWarningRes)) {
      for (let item of dailyWarningRes) {
        const { id, useId, warningVehicleId } = item
        const itemToPush: IItemPush = new IItemPush(`${useId}`, item)
        const resPush = await this.httpCronService.httpCron(itemToPush)
        if (checkIsArrayEmpty(resPush)) this.dailyWarningService.updateSendId(warningVehicleId, true)
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async runEvery7amDailyWarningVehicle() {
    const dailyWarningRes: IDailyWarningsRes = await this.dailyWarningService.getDailyWarningVehicleToNotification()
    if (checkIsArrayEmpty(dailyWarningRes)) {
      for (let item of dailyWarningRes) {
        const { id, useId, warningVehicleId } = item
        const itemToPush: IItemPush = new IItemPush(`${useId}`, item)
        const resPush = await this.httpCronService.httpCron(itemToPush)
        if (checkIsArrayEmpty(resPush)) this.dailyWarningService.updateSendId(warningVehicleId, true)
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async runEvery9amDailyWarning() {
    await this.runEvery7amDailyWarning()
  }

  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async runEvery7pmDailyWarning() {
    await this.runEvery7amDailyWarning()
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async runEvery11pmDailyWarning() {
    await this.runEvery7amDailyWarning()
  }
}