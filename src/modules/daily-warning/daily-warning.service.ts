import { Injectable, NotFoundException } from '@nestjs/common'
import { eq, and, exists, inArray, notInArray, or, like, sql, aliasedTable } from 'drizzle-orm'

import { databaseSchema } from '@/core/database/databaseSchema'
import { DrizzleService } from '@/core/database/drizzle.service'
import { DailyWarningAdd, IIDailyWarningAdd, IDailyWarningsRes, IVehicleDailyWarning, IParamDailyWarning, ISwitchDailyWarning } from './daily-warning.entity'
import { checkIsArrayEmpty } from '@/utilities'
import { jsonSucecced } from './constant'


@Injectable()
export class DailyWarningService {

  public DTdailyWarningsDate = databaseSchema.dailyWarningsDate
  public DTVdailyWarningsDate = aliasedTable(databaseSchema.dailyWarningsDate, 'DTVdailyWarningsDate')
  public DTdailyWarnings = databaseSchema.dailyWarnings
  public DTdailyWarningSends = databaseSchema.dailyWarningSends
  public DTdailyWarningsVehicle = databaseSchema.dailyWarningsVehicle
  public DTdailyWarningsLevel = databaseSchema.dailyWarningsLevel

  constructor(private readonly drizzleService: DrizzleService) { }

  async getAll(userId: number) {
    const dailyWarnings = await this.drizzleService.db
      .select({
        id: this.DTdailyWarnings.id,
        warningName: this.DTdailyWarnings.warningName,
        warningExpired: sql<number>`UNIX_TIMESTAMP(${this.DTdailyWarningsDate.warningDate})`,
        warningPreviousExpired: sql<number>`UNIX_TIMESTAMP(${this.DTVdailyWarningsDate.warningDate})`,
        warningAlert: this.DTdailyWarnings.dailyWarningsLevelId,
        warningType: this.DTdailyWarnings.warningType,
        warningExpiredKm: this.DTdailyWarnings.warningRoad,
        warningPreviousExpiredNumKm: this.DTdailyWarnings.warningRoadLimit,
        isChecked: this.DTdailyWarnings.isChecked,
        isEnabled: this.DTdailyWarnings.isEnabled,
        warningDescription: this.DTdailyWarnings.warningDescription,
        warningPreviousExpiredNum: this.DTdailyWarnings.warningPreviousExpiredNum
      })
      .from(this.DTdailyWarnings)
      .leftJoin(this.DTdailyWarningsLevel, eq(this.DTdailyWarnings.dailyWarningsLevelId, this.DTdailyWarningsLevel.id))
      .leftJoin(this.DTdailyWarningsDate, eq(this.DTdailyWarnings.warningExpiredId, this.DTdailyWarningsDate.id))
      .leftJoin(this.DTVdailyWarningsDate, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTVdailyWarningsDate.id))
      .where(eq(this.DTdailyWarnings.userId, userId))
    return dailyWarnings
  }

  async getWarningVehicle(userId: number, paramsFilter: IParamDailyWarning) {

    const { vehicle, isCheck } = paramsFilter

    const query = await this.drizzleService.db
      .select({
        id: this.DTdailyWarningsVehicle.dailyWarningsId
      })
      .from(this.DTdailyWarningsVehicle)
      .where(eq(this.DTdailyWarningsVehicle.vehicleName, vehicle))

    let stringArr = query.map((item, index) => item.id)
    if (!checkIsArrayEmpty(stringArr)) stringArr.push(0)

    if (isCheck) {
      const dailyWarnings = await this.drizzleService.db
        .select({
          id: this.DTdailyWarnings.id,
          warningName: this.DTdailyWarnings.warningName,
          warningExpired: sql<number>`UNIX_TIMESTAMP(${this.DTdailyWarningsDate.warningDate})`,
          warningPreviousExpired: sql<number>`UNIX_TIMESTAMP(${this.DTVdailyWarningsDate.warningDate})`,
          warningType: this.DTdailyWarnings.warningType,
          warningExpiredKm: this.DTdailyWarnings.warningRoad,
          warningPreviousExpiredNumKm: this.DTdailyWarnings.warningRoadLimit,
          isChecked: this.DTdailyWarnings.isChecked,
          isEnabled: this.DTdailyWarningsVehicle.isEnabled,
          warningDescription: this.DTdailyWarnings.warningDescription,
          warningPreviousExpiredNum: this.DTdailyWarnings.warningPreviousExpiredNum
        })
        .from(this.DTdailyWarnings)
        .leftJoin(this.DTdailyWarningsDate, eq(this.DTdailyWarnings.warningExpiredId, this.DTdailyWarningsDate.id))
        .leftJoin(this.DTVdailyWarningsDate, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTVdailyWarningsDate.id))
        .where(and(eq(this.DTdailyWarnings.userId, userId), notInArray(this.DTdailyWarnings.id, stringArr), like(this.DTdailyWarnings.warningName, `%${paramsFilter.search ? paramsFilter.search : ''}%`)))
      return dailyWarnings
    } else {
      const dailyWarnings = await this.drizzleService.db
        .select({
          id: this.DTdailyWarnings.id,
          warningName: this.DTdailyWarnings.warningName,
          warningExpired: sql<number>`UNIX_TIMESTAMP(${this.DTdailyWarningsDate.warningDate})`,
          warningPreviousExpired: sql<number>`UNIX_TIMESTAMP(${this.DTVdailyWarningsDate.warningDate})`,
          warningType: this.DTdailyWarnings.warningType,
          warningExpiredKm: this.DTdailyWarnings.warningRoad,
          warningPreviousExpiredNumKm: this.DTdailyWarnings.warningRoadLimit,
          isChecked: this.DTdailyWarnings.isChecked,
          isEnabled: this.DTdailyWarningsVehicle.isEnabled,
          warningDescription: this.DTdailyWarnings.warningDescription,
          warningPreviousExpiredNum: this.DTdailyWarnings.warningPreviousExpiredNum
        })
        .from(this.DTdailyWarnings)
        .leftJoin(this.DTdailyWarningsDate, eq(this.DTdailyWarnings.warningExpiredId, this.DTdailyWarningsDate.id))
        .leftJoin(this.DTVdailyWarningsDate, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTVdailyWarningsDate.id))
        .leftJoin(this.DTdailyWarningsVehicle, eq(this.DTdailyWarningsVehicle.dailyWarningsId, this.DTdailyWarnings.id))
        .where(and(eq(this.DTdailyWarningsVehicle.vehicleName, vehicle), eq(this.DTdailyWarnings.userId, userId), inArray(this.DTdailyWarnings.id, stringArr), like(this.DTdailyWarnings.warningName, `%${paramsFilter.search ? paramsFilter.search : ''}%`)))
      return dailyWarnings
    }
  }

  async getDailyWarningToNotification() {
    const dailyWarnings: IDailyWarningsRes = await this.drizzleService.db
      .select({
        id: this.DTdailyWarnings.id,
        warningName: this.DTdailyWarnings.warningName,
        warningExpired: sql<number>`DATE_FORMAT(${this.DTdailyWarningsDate.warningDate}, '%Y%m%d')`,
        warningType: this.DTdailyWarnings.warningType,
        warningDescription: this.DTdailyWarnings.warningDescription,
        useId: this.DTdailyWarnings.userId,
        warningVehicleId: this.DTdailyWarningsVehicle.id
      })
      .from(this.DTdailyWarningsDate)
      .innerJoin(this.DTdailyWarnings, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTdailyWarningsDate.id))
      .leftJoin(this.DTdailyWarningsVehicle, eq(this.DTdailyWarnings.id, this.DTdailyWarningsVehicle.dailyWarningsId))
      .innerJoin(this.DTdailyWarningSends, eq(this.DTdailyWarningsVehicle.id, this.DTdailyWarningSends.warningVehicleId))
      .where(and(eq(this.DTdailyWarnings.isChecked, false), eq(this.DTdailyWarnings.isEnabled, false)))
    return dailyWarnings
  }

  async getDailyWarningVehicleToNotification() {
    const dailyWarnings: IDailyWarningsRes = await this.drizzleService.db
      .select({
        id: this.DTdailyWarnings.id,
        warningName: this.DTdailyWarnings.warningName,
        warningExpired: sql<number>`DATE_FORMAT(${this.DTdailyWarningsDate.warningDate}, '%Y%m%d')`,
        warningType: this.DTdailyWarnings.warningType,
        warningDescription: this.DTdailyWarnings.warningDescription,
        useId: this.DTdailyWarnings.userId,
        warningVehicleId: this.DTdailyWarningsVehicle.id
      })
      .from(this.DTdailyWarningsVehicle)
      .innerJoin(this.DTdailyWarnings, eq(this.DTdailyWarningsVehicle.dailyWarningsId, this.DTdailyWarnings.id))
      .leftJoin(this.DTdailyWarningsDate, eq(this.DTdailyWarnings.warningPreviousExpiredId, this.DTdailyWarningsDate.id))
      .innerJoin(this.DTdailyWarningSends, eq(this.DTdailyWarningsVehicle.id, this.DTdailyWarningSends.warningVehicleId))
      .where(and(eq(this.DTdailyWarnings.isChecked, true), eq(this.DTdailyWarnings.isEnabled, false), eq(this.DTdailyWarningsVehicle.isEnabled, false)))

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

  async getByListVehicleId(id: number) {
    const dailyWarningVehicle = await this.drizzleService.db
      .select({
        vehicleName: this.DTdailyWarningsVehicle.vehicleName,
      })
      .from(this.DTdailyWarningsVehicle)
      .where(eq(this.DTdailyWarningsVehicle.dailyWarningsId, id))

    if (!dailyWarningVehicle) {
      throw new NotFoundException()
    }
    const dailyWarningVehicleReturn = dailyWarningVehicle.map((item) => item.vehicleName)
    return dailyWarningVehicleReturn
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
        const { warningExpired, warningPreviousExpired, isChecked, warningExpiredKm, warningPreviousExpiredNumKm, vehicles, dailyWarningsLevelId } = dailyWarning
        let warningExpiredIdIndex: number = 0
        let warningPreviousExpiredIdIndex: number = 0
        if (isChecked) {
          warningExpiredIdIndex = await this.cUWarningDate(warningExpired, tx)
          warningPreviousExpiredIdIndex = await this.cUWarningDate(warningPreviousExpired, tx)
          if (warningExpired < warningPreviousExpired) throw new NotFoundException()
        } else {
          if (warningExpiredKm <= warningPreviousExpiredNumKm) throw new NotFoundException()
        }

        const iIDailyWarningAdd: IIDailyWarningAdd = new IIDailyWarningAdd(dailyWarning)

        const warningExpiredId = await tx
          .insert(this.DTdailyWarnings)
          .values({
            ...iIDailyWarningAdd,
            warningExpiredId: warningExpiredIdIndex,
            dailyWarningsLevelId: dailyWarningsLevelId,
            warningPreviousExpiredId: warningPreviousExpiredIdIndex,
            warningRoad: warningExpiredKm,
            warningRoadLimit: warningPreviousExpiredNumKm,
            isChecked: isChecked
          })

        const index = warningExpiredId[0].insertId
        if (!index) {
          throw new NotFoundException()
        }

        if (checkIsArrayEmpty(vehicles)) {
          for (let item of vehicles) {
            const warningVehiclesId = await tx
              .insert(this.DTdailyWarningsVehicle)
              .values({
                vehicleName: item,
                dailyWarningsId: index
              })

            const indexVehicle = warningVehiclesId[0].insertId

            if (indexVehicle) {
              await tx
                .insert(this.DTdailyWarningSends)
                .values({
                  warningVehicleId: indexVehicle
                })
            }
          }
        }

        return jsonSucecced

      } catch (error) {
        throw new NotFoundException()
      }
    })
  }

  async addVehicleDailyWarning(vehicleDailyWarning: IVehicleDailyWarning) {
    const { nameVehicle, listIdWarning } = vehicleDailyWarning
    IVehicleDailyWarning
    if (checkIsArrayEmpty(listIdWarning)) {
      return await this.drizzleService.db.transaction(async (tx) => {
        try {
          for (let item of listIdWarning) {
            await
              tx.insert(this.DTdailyWarningsVehicle)
                .values({
                  vehicleName: nameVehicle,
                  dailyWarningsId: item
                })
          }
          return { ...jsonSucecced }

        } catch (error) {

        }
      })
    }
  }

  async update(id: number, dailyWarning: DailyWarningAdd) {
    return await this.drizzleService.db.transaction(async (tx) => {
      try {
        const { warningExpired, warningPreviousExpired, isChecked, warningExpiredKm, warningPreviousExpiredNumKm, vehicles } = dailyWarning
        let warningExpiredIdIndex: number = 0
        let warningPreviousExpiredIdIndex: number = 0

        if (isChecked) {
          warningExpiredIdIndex = await this.cUWarningDate(warningExpired, tx)
          warningPreviousExpiredIdIndex = await this.cUWarningDate(warningPreviousExpired, tx)
          if (warningExpired < warningPreviousExpired) throw new NotFoundException()
        } else {
          if (warningExpiredKm < warningPreviousExpiredNumKm) throw new NotFoundException()
        }
        const iIDailyWarningAdd: IIDailyWarningAdd = new IIDailyWarningAdd(dailyWarning)
        const warningExpiredId = await tx
          .update(this.DTdailyWarnings)
          .set({
            ...iIDailyWarningAdd,
            warningExpiredId: warningExpiredIdIndex,
            warningPreviousExpiredId: warningPreviousExpiredIdIndex,
            warningRoad: warningExpiredKm,
            warningRoadLimit: warningPreviousExpiredNumKm,
            isChecked: isChecked
          })
          .where(eq(databaseSchema.dailyWarnings.id, id))

        const index = warningExpiredId[0].affectedRows
        if (checkIsArrayEmpty(vehicles)) {
          const vehicleList = await tx
            .select({
              id: this.DTdailyWarningsVehicle.id
            })
            .from(this.DTdailyWarningsVehicle)
            .where(sql`${this.DTdailyWarningsVehicle.dailyWarningsId} = ${index}`)
          const listVehicleId: Array<number> = vehicleList.map((item) => item.id)
          if (checkIsArrayEmpty(listVehicleId)) {
            await tx
              .delete(this.DTdailyWarningSends)
              .where(inArray(this.DTdailyWarningSends.warningVehicleId, listVehicleId))

            await tx
              .delete(this.DTdailyWarningsVehicle)
              .where(eq(this.DTdailyWarningsVehicle.dailyWarningsId, index))
          }

          for (let item of vehicles) {
            const warningVehiclesId = await tx
              .insert(this.DTdailyWarningsVehicle)
              .values({
                ...iIDailyWarningAdd,
                vehicleName: item,
                dailyWarningsId: index
              })

            const indexVehicle = warningVehiclesId[0].insertId

            if (indexVehicle) {
              await tx
                .insert(this.DTdailyWarningSends)
                .values({
                  warningVehicleId: indexVehicle
                })
            }
          }
        }

        return jsonSucecced

      } catch (error) {
        throw new NotFoundException()
      }
    })
  }

  async updateSwitch(switchDailyWarning: ISwitchDailyWarning) {
    const { id, isEnabled, isVehicle, nameVehicle } = switchDailyWarning
    
    if (isVehicle && nameVehicle) {
      await this.drizzleService.db
        .update(this.DTdailyWarningsVehicle)
        .set({ isEnabled: !isEnabled })
        .where(and(eq(this.DTdailyWarningsVehicle.vehicleName, nameVehicle), eq(this.DTdailyWarningsVehicle.dailyWarningsId, id)))
    } else {
      await this.drizzleService.db
        .update(this.DTdailyWarnings)
        .set({ isEnabled: !isEnabled })
        .where(eq(this.DTdailyWarnings.id, id))
    }
    return jsonSucecced
  }

  async updateSendId(id: number, isSend: boolean = false) {
    await this.drizzleService.db
      .update(this.DTdailyWarningSends)
      .set({ isSend: isSend })
      .where(eq(this.DTdailyWarningSends.warningVehicleId, id))
  }

  async delete(id: number) {
    await this.drizzleService.db.transaction(async (tx) => {
      await tx
        .delete(databaseSchema.dailyWarnings)
        .where(eq(databaseSchema.dailyWarnings.id, id))
    })
  }
}
