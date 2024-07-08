import { CreateDailyWarningDto } from './dto'

class IVehicleDailyWarning {
    nameVehicle: string
    listIdWarning?: Array<number>
}

class IParamDailyWarning {
    vehicle?: string
    search?: string
    isCheck?: boolean
}

class IParamDailyWarningFilter {
    vehicle?: string
    search?: string
    isCheck?: boolean

    constructor(vehicle?: string,
        search?: string,
        isCheck?: boolean) {
        this.vehicle = vehicle
        this.search = search
        this.isCheck = isCheck ? true : false
    }
}


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
    vehicles: Array<string> | null
    isChecked: boolean
    warningExpiredKm: number
    warningPreviousExpiredNumKm: number
    dailyWarningsLevelId: number
}

class IIDailyWarningAdd {
    warningName: string
    warningType: string
    warningDescription: string
    userId: number
    warningPreviousExpiredNum: number
    vehicles: Array<string> | null
    isChecked: boolean
    warningExpiredKm: number
    warningPreviousExpiredNumKm: number

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
    vehicles: Array<string> | null
    isChecked: boolean
    warningExpiredKm: number
    warningPreviousExpiredNumKm: number
    dailyWarningsLevelId: number

    constructor(dailyWarning: CreateDailyWarningDto,
        userId: number
    ) {
        const { warningName, warningExpired, warningPreviousExpired, warningType, warningDescription, warningPreviousExpiredNum, vehicles, isChecked, warningExpiredKm, warningPreviousExpiredNumKm, warningAlert } = dailyWarning
        this.warningName = warningName
        this.warningExpired = new Date((parseInt(`${warningExpired}`) ?? 0) * 1000)
        this.warningPreviousExpired = new Date(warningPreviousExpired)
        this.warningType = warningType
        this.warningDescription = warningDescription
        this.userId = userId
        this.warningPreviousExpiredNum = warningPreviousExpiredNum ? parseInt(`${warningPreviousExpiredNum}`) : 0
        this.vehicles = vehicles
        this.isChecked = isChecked ? true : false
        this.warningExpiredKm = warningExpiredKm ? parseInt(`${warningExpiredKm}`) : 0
        this.warningPreviousExpiredNumKm = warningPreviousExpiredNumKm ? parseInt(`${warningPreviousExpiredNumKm}`) : 0
        this.dailyWarningsLevelId = warningAlert ? parseInt(`${warningAlert}`) : 0
    }
}

type IDailyWarningsItemRes = {
    id: number
    warningName: string
    warningExpired: number
    warningType: string
    warningDescription: string
    useId: number
    warningVehicleId: number
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

interface ISwitchDailyWarning {
    id: number
    isEnabled?: boolean
    isVehicle?: boolean
    nameVehicle?: string
}


type IImportXcel = {
    [k: string]: string
}

export {
    DailyWarning,
    DailyWarningAdd,
    IDailyWarningAdd,
    IIDailyWarningAdd,
    IDailyWarningsRes,
    IDailyWarningsItem,
    IDailyWarningsItemRes,
    IVehicleDailyWarning,
    IParamDailyWarning,
    IParamDailyWarningFilter,
    ISwitchDailyWarning,
    IImportXcel
}
