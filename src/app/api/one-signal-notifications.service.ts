import {Injectable} from '@angular/core';
import OneSignal from "onesignal-cordova-plugin";
import {AppSettings} from '../AppSettings';

@Injectable({
    providedIn: 'root'
})
export class OneSignalNotificationsService {

    constructor() {}

    inicialiceNotifications(api: string) {
        OneSignal.setAppId(api);
        // OneSignal.setAppId(AppSettings.ONE_SIGNAL);
        OneSignal.setNotificationOpenedHandler(function (jsonData) {
        });
        OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
        });
    }

    setUserExternal() {

        if (this.existSession()) {
            const userSystemId = this.getUserSystem();
            // Setting External User Id with Callback Available in SDK Version 2.11.2+
            window['plugins'].OneSignal.setExternalUserId(userSystemId, (results) => {
                // The results will contain push and email success statuses

                // Push can be expected in almost every situation with a success status, but
                // as a pre-caution its good to verify it exists
                if (results.push && results.push.success) {

                }
            });
        }
    }

    unSetUserExternal() {

        window['plugins'].OneSignal.removeExternalUserId((results) => {
            // The results will contain push and email success statuses

            // Push can be expected in almost every situation with a success status, but
            // as a pre-caution its good to verify it exists
            if (results.push && results.push.success) {

            }
        });
    }

    existSession() {
        try {
            const tk_str = localStorage.getItem("tk_str");
            if (tk_str != null && tk_str != "") {
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
    getUserSystem() {
        try {
            if (this.existSession()) {
                const usuarioSistema = JSON.parse(localStorage.getItem("u_sistema"));
                return usuarioSistema.id_usuario_sistema;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }
}
