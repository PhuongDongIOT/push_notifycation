import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { IObjectSendNotifycation, IHeadersOption } from './cron.entity'
import { env } from '@/config/config'

const headersOption: IHeadersOption = {
    'Content-Type': 'application/json',
    'x-mid-token-notification': env.X_MID_TOKEN_PUSH
}

@Injectable()
export class HttpCronService {
    private routePushUser: string = '/notify/to/users'

    constructor(private readonly httpService: HttpService) { }

    async httpCron(objectSendNotifycation: IObjectSendNotifycation) {
        try {
            const observable = await this.httpService.post(`${env.HOST_PUSH_NOTIFYCATION}${this.routePushUser}`,
                objectSendNotifycation,
                {
                    headers: headersOption
                }
            )
            const { data } = await observable.toPromise();
            const { results = null } = data
            return results
        } catch (error) {
            return null
        }
    }

}
