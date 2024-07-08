import { Injectable, NotFoundException } from '@nestjs/common'
import { eq, and, inArray, notInArray, like, sql, aliasedTable } from 'drizzle-orm'

import { databaseSchema } from '@/core/database/databaseSchema'
import { DrizzleService } from '@/core/database/drizzle.service'
import { DailyWarningAdd, IIDailyWarningAdd, IDailyWarningsRes, IVehicleDailyWarning, IParamDailyWarning, ISwitchDailyWarning, IImportXcel } from './daily-warning.entity'
import { checkIsArrayEmpty, apartDayinDate, toNumber, numberToBoolean, stringSplitToArray } from '@/utilities'
import { jsonSucecced } from './constant'
import { WorkSheet, Range, utils } from 'xlsx'
import { log } from 'console'


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
    let dailyWarnings = await this.drizzleService.db
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
    if (checkIsArrayEmpty(dailyWarnings)) {
      const arrDailyWarnings = dailyWarnings.map((item) => item.id)
      const dailyWarningsVehicle = await this.drizzleService.db
        .select({
          dailyWarningsId: this.DTdailyWarningsVehicle.dailyWarningsId,
          vehicle: this.DTdailyWarningsVehicle.vehicleName
        })
        .from(this.DTdailyWarningsVehicle)
        .where(inArray(this.DTdailyWarningsVehicle.dailyWarningsId, arrDailyWarnings))

      let newObjectDailyWarningsVehicle = dailyWarningsVehicle.reduce((obj, current, index) => {
        if (obj[current.dailyWarningsId]) {
          obj[current.dailyWarningsId] = [...obj[current.dailyWarningsId], current.vehicle];
        } else {
          obj[current.dailyWarningsId] = [current.vehicle];
        }
        return obj;
      }, {})

      dailyWarnings.map((item) => {
        if (newObjectDailyWarningsVehicle[item.id]) {
          item['vehicles'] = newObjectDailyWarningsVehicle[item.id]
        } else {
          item['vehicles'] = []
        }
        return item
      })
    }
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

  async deleleListOrItemWarning(id: number, tx?: any) {
    let transaction = tx ? tx : this.drizzleService.db

    const listVehicleWarning = await transaction
      .select({
        id: this.DTdailyWarningsVehicle.id
      })
      .from(this.DTdailyWarningsVehicle)
      .where(eq(this.DTdailyWarningsVehicle.dailyWarningsId, id))

    if (checkIsArrayEmpty(listVehicleWarning)) {
      const listVehicleWarningId: Array<number> = listVehicleWarning.map((item) => item.id)

      await transaction
        .delete(this.DTdailyWarningSends)
        .where(inArray(this.DTdailyWarningSends.warningVehicleId, listVehicleWarningId))
      await transaction
        .delete(this.DTdailyWarningsVehicle)
        .where(eq(this.DTdailyWarningsVehicle.dailyWarningsId, id))
    }

    await transaction
      .delete(this.DTdailyWarnings)
      .where(eq(this.DTdailyWarnings.id, id))
  }

  async delete(id: number, listDeleted?: Array<number>) {
    return await this.drizzleService.db.transaction(async (tx) => {
      if (checkIsArrayEmpty(listDeleted)) {
        for (let item of listDeleted) {
          await this.deleleListOrItemWarning(item, tx)
        }
      } else {
        await this.deleleListOrItemWarning(id, tx)
      }
      return jsonSucecced
    })
  }


  async transationImportDataXcel(userId: number, sheet: WorkSheet, range: Range) {

    const arrayItemWarningHead: Array<string> = ['index', 'warningName', 'warningAlert', 'warningType', 'warningDescription', 'vehicles', 'isChecked']
    const arrayItemDate: Array<string> = ['warningExpired', 'warningPreviousExpiredNum']
    const arrayItemRoad: Array<string> = ['warningExpiredKm', 'warningPreviousExpiredNumKm']
    let arrayDailyWarning: Array<IImportXcel> = []
    for (let R = range.s.r; R <= range.e.r; ++R) {
      if (R === 0 || !sheet[utils.encode_cell({ c: 0, r: R })]) {
        continue;
      }
      let isChecked: string | number = sheet[utils.encode_cell({ c: 7, r: R })]?.v
      isChecked = parseInt(`${isChecked}`) ?? 0
      const arrayItemWrning: Array<string> = isChecked ? [...arrayItemWarningHead, ...arrayItemDate] : [...arrayItemWarningHead, ...arrayItemRoad]
      let itemDailyWarning: IImportXcel = {}
      arrayItemWrning.map((item: string, index) => {
        itemDailyWarning[item] = sheet[utils.encode_cell({ c: index++, r: R })]?.v
      })
      arrayDailyWarning.push(itemDailyWarning)
    }

    if (checkIsArrayEmpty(arrayDailyWarning)) {
      return await this.drizzleService.db.transaction(async (tx) => {
        for (let dailyWarning of arrayDailyWarning) {
          try {
            const {
              warningName,
              warningExpired,
              warningPreviousExpired,
              isChecked,
              warningExpiredKm,
              warningPreviousExpiredNumKm,
              warningPreviousExpiredNum,
              vehicles,
              warningAlert,
              warningType,
              warningDescription } = dailyWarning
            let warningExpiredIdIndex: number = 0
            let warningPreviousExpiredIdIndex: number = 0
            if (isChecked && warningExpired) {
              if (typeof warningExpired === 'string') {
                let arrayStringDate = warningExpired.split("-").map(item => toNumber(item))
                let stringToDate: Date = new Date(arrayStringDate[2], arrayStringDate[1] - 1, arrayStringDate[0])
                let apartWarningPreviousExpired = apartDayinDate(stringToDate, toNumber(warningPreviousExpiredNum))
                warningExpiredIdIndex = await this.cUWarningDate(stringToDate, tx)
                warningPreviousExpiredIdIndex = await this.cUWarningDate(apartWarningPreviousExpired, tx)
              }
              if (warningExpired < warningPreviousExpired) throw new NotFoundException()
            } else {
              if (warningExpiredKm <= warningPreviousExpiredNumKm) throw new NotFoundException()
            }

            const warningExpiredId = await tx
              .insert(this.DTdailyWarnings)
              .values({
                warningName: warningName,
                isChecked: numberToBoolean(isChecked),
                userId: userId,
                warningType: warningType,
                warningDescription: warningDescription,
                warningExpiredId: warningExpiredIdIndex,
                warningPreviousExpiredId: warningPreviousExpiredIdIndex,
                dailyWarningsLevelId: toNumber(warningAlert),
                warningPreviousExpiredNum: toNumber(warningPreviousExpiredNumKm),
                warningRoad: toNumber(warningExpiredKm),
                warningRoadLimit: toNumber(warningPreviousExpiredNumKm)
              })

            const index = warningExpiredId[0].insertId
            if (!index) {
              throw new NotFoundException()
            }

            const listVehicle: Array<string | number> = stringSplitToArray(vehicles, 'string', ',')
            if (checkIsArrayEmpty(listVehicle)) {
              for (let item of listVehicle) {
                if (typeof item === 'string') {
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
            }

          } catch (error) {
            throw new NotFoundException()
          }

          return jsonSucecced
        }
      })
    }
  }
}
