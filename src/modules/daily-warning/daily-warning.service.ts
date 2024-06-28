import { Injectable, NotFoundException } from '@nestjs/common'
import { eq, sql, aliasedTable } from 'drizzle-orm'

import { databaseSchema } from '../../core/database/databaseSchema'
import { DrizzleService } from '../../core/database/drizzle.service'
import { DailyWarningAdd, IIDailyWarningAdd, IDailyWarningsRes } from './daily-warning.entity'


@Injectable()
export class DailyWarningService {

  public DTdailyWarningsDate = databaseSchema.dailyWarningsDate
  public DTVdailyWarningsDate = aliasedTable(databaseSchema.dailyWarningsDate, 'DTVdailyWarningsDate')
  public DTdailyWarnings = databaseSchema.dailyWarnings
  public DTdailyWarningSends = databaseSchema.dailyWarningSends

  constructor(private readonly drizzleService: DrizzleService) { }

  async getAll(userId: number) {

    const dailyWarnings = await this.drizzleService.db
      .select({
        id: this.DTdailyWarnings.id,
        warningName: this.DTdailyWarnings.warningName,
        warningExpired: sql<number>`UNIX_TIMESTAMP(${this.DTdailyWarningsDate.warningDate})`,
        warningPreviousExpired: sql<number>`UNIX_TIMESTAMP(${this.DTVdailyWarningsDate.warningDate})`,
        warningType: this.DTdailyWarnings.warningType,
        warningDescription: this.DTdailyWarnings.warningDescription,
        warningPreviousExpiredNum: this.DTdailyWarnings.warningPreviousExpiredNum,
        disabled: this.DTdailyWarningSends.isSend,
      })
      .from(this.DTdailyWarnings)
      .innerJoin(this.DTdailyWarningsDate, eq(this.DTdailyWarnings.warningExpiredId, this.DTdailyWarningsDate.id))
      .innerJoin(this.DTdailyWarningSends, eq(this.DTdailyWarnings.id, this.DTdailyWarningSends.warningId))
      .leftJoin(this.DTVdailyWarningsDate, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTVdailyWarningsDate.id))
      .where(eq(this.DTdailyWarnings.userId, userId))
      
    return dailyWarnings
  }

  async getDailyWarningToNotification() {
    const dailyWarnings: IDailyWarningsRes = await this.drizzleService.db
      .select({
        id: this.DTdailyWarnings.id,
        warningName: this.DTdailyWarnings.warningName,
        warningExpired: sql<number>`DATE_FORMAT(${this.DTdailyWarningsDate.warningDate}, '%Y%m%d')`,
        warningType: this.DTdailyWarnings.warningType,
        warningDescription: this.DTdailyWarnings.warningDescription,
        useId: this.DTdailyWarnings.userId
      })
      .from(this.DTdailyWarningsDate)
      .innerJoin(this.DTdailyWarnings, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTdailyWarningsDate.id))
      .innerJoin(this.DTdailyWarningSends, eq(this.DTdailyWarnings.id, this.DTdailyWarningSends.warningId))
      .where(sql`${this.DTdailyWarningsDate.warningDate} = DATE(${new Date()}) AND ${this.DTdailyWarningSends.isSend} = 0`)
      
    return dailyWarnings
  }

  async getById(id: number) {
    const dailyWarning = await this.drizzleService.db
      .select({
        id: this.DTdailyWarnings.id,
        warningName: this.DTdailyWarnings.warningName,
        warningExpired: sql<number>`UNIX_TIMESTAMP(${this.DTdailyWarningsDate.warningDate})`,
        warningPreviousExpired: sql<number>`UNIX_TIMESTAMP(${this.DTVdailyWarningsDate.warningDate})`,
        warningType: this.DTdailyWarnings.warningType,
        warningDescription: this.DTdailyWarnings.warningDescription,
      })
      .from(this.DTdailyWarnings)
      .innerJoin(this.DTdailyWarningsDate, eq(this.DTdailyWarnings.warningExpiredId, this.DTdailyWarningsDate.id))
      .innerJoin(this.DTVdailyWarningsDate, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTdailyWarningsDate.id))
      .where(eq(this.DTdailyWarnings.id, id))

    if (!dailyWarning) {
      throw new NotFoundException()
    }
    return dailyWarning
  }

  async cUWarningDate(warningDate: Date, tx: any): Promise<number> {
    let transaction = tx ? tx : this.drizzleService.db

    let warningDateIdIndex: number | undefined = undefined
    const warningExpiredId = await transaction
      .select()
      .from(this.DTdailyWarningsDate)
      .where(sql`${this.DTdailyWarningsDate.warningDate} = DATE(${warningDate})`)
      .limit(1)
    if (warningExpiredId[0]?.id) {
      warningDateIdIndex = warningExpiredId[0]?.id
    } else {
      const warningExpiredId = await transaction
        .insert(this.DTdailyWarningsDate)
        .values({
          warningDate: warningDate
        })
      warningDateIdIndex = warningExpiredId[0].insertId
    }

    return warningDateIdIndex
  }

  async create(dailyWarning: DailyWarningAdd) {
    return await this.drizzleService.db.transaction(async (tx) => {
      try {

        const warningExpiredIdIndex: number = await this.cUWarningDate(dailyWarning.warningExpired, tx)
        const warningPreviousExpiredIdIndex: number = await this.cUWarningDate(dailyWarning.warningPreviousExpired, tx)
        if(dailyWarning.warningExpired < dailyWarning.warningPreviousExpired) throw new NotFoundException()

        const iIDailyWarningAdd: IIDailyWarningAdd = new IIDailyWarningAdd(dailyWarning)
        const warningExpiredId = await tx
          .insert(this.DTdailyWarnings)
          .values({
            ...iIDailyWarningAdd,
            warningExpiredId: warningExpiredIdIndex,
            warningPreviousExpiredId: warningPreviousExpiredIdIndex
          })

        const index = warningExpiredId[0].insertId
        if (!index) {
          throw new NotFoundException()
        } else {
          await tx
          .insert(this.DTdailyWarningSends)
          .values({
            warningId: index
          })
          
          return {
            result: 1
          }
        }

      } catch (error) {
        throw new NotFoundException()
      }
    })
  }

  async update(id: number, dailyWarning: DailyWarningAdd) {
    return await this.drizzleService.db.transaction(async (tx) => {
      try {
        const warningExpiredIdIndex: number = await this.cUWarningDate(dailyWarning.warningExpired, tx)
        const warningPreviousExpiredIdIndex: number = await this.cUWarningDate(dailyWarning.warningPreviousExpired, tx)

        if(dailyWarning.warningExpired < dailyWarning.warningPreviousExpired) throw new NotFoundException()

        
        const iIDailyWarningAdd: IIDailyWarningAdd = new IIDailyWarningAdd(dailyWarning)
        const warningExpiredId = await tx
          .update(this.DTdailyWarnings)
          .set({
            ...iIDailyWarningAdd,
            warningExpiredId: warningExpiredIdIndex,
            warningPreviousExpiredId: warningPreviousExpiredIdIndex
          })
          .where(eq(databaseSchema.dailyWarnings.id, id))
          
        const index = warningExpiredId[0].affectedRows
        if (!index) {
          throw new NotFoundException()
        } else {
          return {
            result: 1
          }
        }

      } catch (error) {
        throw new NotFoundException()
      }
    })
  }

  async updateSendId(id: number, isSend: boolean = false) {
    const I = await this.drizzleService.db
      .update(databaseSchema.dailyWarningSends)
      .set({ isSend: isSend })
      .where(eq(databaseSchema.dailyWarningSends.warningId, id))
  }

  async delete(id: number) {
    await this.drizzleService.db.transaction(async (tx) => {
      await tx
        .delete(databaseSchema.dailyWarnings)
        .where(eq(databaseSchema.dailyWarnings.id, id))

      await tx
        .delete(databaseSchema.dailyWarningSends)
        .where(eq(databaseSchema.dailyWarningSends.warningId, id))
    })


  }
}
