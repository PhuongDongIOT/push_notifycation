abstract class AbstractDailyWarningExcel {

}

class ClassConvertDataExcel {
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

    constructor(dailyWarning: any) {
        const { warningName, warningExpired, warningPreviousExpired, warningType, warningDescription, warningPreviousExpiredNum, vehicles, isChecked, warningExpiredKm, warningPreviousExpiredNumKm, warningAlert } = dailyWarning
        this.warningName = warningName
        this.warningExpired = new Date((parseInt(`${warningExpired}`) ?? 0) * 1000)
        this.warningPreviousExpired = new Date(warningPreviousExpired)
        this.warningType = warningType
        this.warningDescription = warningDescription
        this.warningPreviousExpiredNum = warningPreviousExpiredNum ? parseInt(`${warningPreviousExpiredNum}`) : 0
        this.vehicles = vehicles
        this.isChecked = isChecked ? true : false
        this.warningExpiredKm = warningExpiredKm ? parseInt(`${warningExpiredKm}`) : 0
        this.warningPreviousExpiredNumKm = warningPreviousExpiredNumKm ? parseInt(`${warningPreviousExpiredNumKm}`) : 0
        this.dailyWarningsLevelId = warningAlert ? parseInt(`${warningAlert}`) : 0
    }
}

class DailyWarningExcel extends AbstractDailyWarningExcel {
    private dataImportDailyWarning: Array<ClassConvertDataExcel>

    protected convertDataExcel(itemDailyWarning: any) {
        const convertDataExcel: ClassConvertDataExcel = new ClassConvertDataExcel(itemDailyWarning)
        return convertDataExcel
    }

    protected checkInputTypeDataExcel() {

    }


    protected checkInputTypeExcel() {

    }

    protected updateInputDataExcel() {

    }
}