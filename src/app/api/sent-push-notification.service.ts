import { Injectable } from '@angular/core';
import { AppSettings } from '../AppSettings';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP } from "@ionic-native/http/ngx";
import { SentNotificationModel } from "../Modelos/OneSignalNotificationsModel/SentNotificationModel";

@Injectable({
    providedIn: 'root'
})
export class SentPushNotificationService {

    constructor(private _http: HTTP) {
    }
    /**
     * @author Juan Antonio
     * @param contentModel
     * @param token
     * @description Servicio para enviar notificaciones
     */
        sentNotification(contentModel: SentNotificationModel, token: string): Observable<any> /*Para Producción*/ {
            // contentModel.app_id = AppSettings.ONE_SIGNAL;
            // token = AppSettings.LOCAL_TOKEN;
        const body = JSON.stringify(contentModel);
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
    /**
     * @author Juan Antonio
     * @description Obtiene el token y api para el servicio de notificaciones
     */
    getTkn(): Observable<any> {
        const body = JSON.stringify({});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(`${AppSettings.API_ENDPOINT}` + 'api/service/token', body, AppSettings.getHeadersToken())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }
    /**
     * @author Juan Antonio
     * @description Obtiene el api para el servicio de notificaciones
     */
    getApi(): Observable<any> {
        const body = JSON.stringify({});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(`${AppSettings.API_ENDPOINT}` + 'api/service/oneSignal/api', body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }
    /**
     * @param idPersona
     * @author Juan Antonio
     * @description Obtiene el id del usuario sistema por el id persona
     */
    getUserByPersona(idPersona: string): Observable<any> {
        const body = JSON.stringify({ id_persona: idPersona });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(`${AppSettings.API_ENDPOINT}` + 'api/information/usuario', body, AppSettings.getHeadersToken()).then(
            (data) => {
                return JSON.parse(data.data);
            }).catch((error) => {
                return error;
            }));
    }
}
