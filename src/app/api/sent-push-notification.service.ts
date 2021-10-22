import {Injectable} from '@angular/core';
import {AppSettings} from '../AppSettings';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HTTP} from "@ionic-native/http/ngx";
import {SentNotificationModel} from "../Modelos/OneSignalNotificationsModel/SentNotificationModel";

@Injectable({
    providedIn: 'root'
})
export class SentPushNotificationService {

    url = `${AppSettings.API_ENDPOINT}`;

    constructor(private _http: HTTP) {
    }

    sentNotification(content: SentNotificationModel, token: string): Observable<any> {
        const body = JSON.stringify(content);
        this._http.setDataSerializer("utf8");
        return from(this._http.post('https://onesignal.com/api/v1/notifications', body,
            AppSettings.getHeadersNotifications(token))
            .then(data => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            })).pipe(map(data => {
            return data;
        }));
    }

    getToken() {
        const body = JSON.stringify({});
        this._http.setDataSerializer("utf8");
        return from(this._http.post(this.url + 'api/service/token', body,
            AppSettings.getHeadersToken())
            .then(data => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            })).pipe(map(data => {
            return data;
        }));
    }
}
