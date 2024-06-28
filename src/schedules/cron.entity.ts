import { IDailyWarningsItemRes } from '@/modules/daily-warning/daily-warning.entity'
import { Type, type Static } from '@sinclair/typebox'
import {keyMapUserPush, aTypeNotify, typeNotify} from '@/constants'
import {addCharToString} from '@/utilities'

const IUserList = Type.Array(Type.String())

const INotifyPacket = Type.Object({
    image: Type.String(),
    title: Type.String(),
    body: Type.String(),
    aType: Type.String(),
    type: Type.String(),
    navigation: Type.String()
})
type INotifyPacket = Static<typeof INotifyPacket>

const IObjectSendNotifycation = Type.Object({
    userList: IUserList,
    notifyPacket: INotifyPacket
})

type IObjectSendNotifycation = Static<typeof IObjectSendNotifycation>


const IHeadersOption = Type.Object({
    'Content-Type': Type.String(),
    'x-mid-token-notification': Type.String()
})

type IHeadersOption = Static<typeof IHeadersOption>

class IItemPush {
    userList: string[]
    notifyPacket: INotifyPacket
    constructor(user: string, dailyWarningsItemRes: IDailyWarningsItemRes) {
        const madStringUser: string = addCharToString([keyMapUserPush, user])
        this.userList = [madStringUser]
        this.notifyPacket = {
            image: '',
            title:`${dailyWarningsItemRes.warningName}${dailyWarningsItemRes.warningExpired}`,
            body: dailyWarningsItemRes.warningDescription,
            aType: aTypeNotify,
            type: typeNotify,
            navigation: ''
        }
    }
}

export {
    IUserList,
    INotifyPacket,
    IObjectSendNotifycation,
    IHeadersOption,
    IItemPush
}