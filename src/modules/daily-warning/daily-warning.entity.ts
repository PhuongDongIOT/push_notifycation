
import { CreateDailyWarningDto } from './dto'

class DailyWarning {
    id?: number
    warningName: string
    warningExpired: Date
    warningPreviousExpired: Date
    warningType: Date
    warningDescription?: string
}

class DailyWarningAdd {
    warningName?: string
    warningExpired?: Date
    warningPreviousExpired?: Date
    warningType?: string
    warningDescription?: string
    userId?: number
    warningPreviousExpiredNum?: number
}

class IIDailyWarningAdd {
    warningName: string
    warningType: string
    warningDescription: string
    userId: number
    warningPreviousExpiredNum: number

    constructor(dailyWarning: DailyWarningAdd
    ) {
        const { warningName, warningType, warningDescription, userId, warningPreviousExpiredNum } = dailyWarning
        this.warningName = warningName
        this.warningType = warningType
        this.warningDescription = warningDescription
        this.userId = userId
        this.warningPreviousExpiredNum = warningPreviousExpiredNum
    }
}

class IDailyWarningAdd {
    warningName: string
    warningExpired: Date
    warningPreviousExpired: Date
    warningType: string
    warningDescription: string
    userId: number
    warningPreviousExpiredNum: number

    constructor(dailyWarning: CreateDailyWarningDto,
        userId: number
    ) {
        const { warningName, warningExpired, warningPreviousExpired, warningType, warningDescription, warningPreviousExpiredNum } = dailyWarning
        this.warningName = warningName
        this.warningExpired = new Date(warningExpired * 1000)
        this.warningPreviousExpired = new Date(warningPreviousExpired)
        this.warningType = warningType
        this.warningDescription = warningDescription
        this.userId = userId
        this.warningPreviousExpiredNum = warningPreviousExpiredNum
    }
}

type IDailyWarningsItemRes = {
    id: number
    warningName: string
    warningExpired: number
    warningType: string
    warningDescription: string
    useId: number
}

type IDailyWarningsRes = Array<IDailyWarningsItemRes>

type IDailyWarningsItem = {
    id: number
    warningName: string
    warningExpired: number
    warningType: string
    warningDescription: string
    useId: number
}

export {
    DailyWarning,
    DailyWarningAdd,
    IDailyWarningAdd,
    IIDailyWarningAdd,
    IDailyWarningsRes,
    IDailyWarningsItem,
    IDailyWarningsItemRes
}
