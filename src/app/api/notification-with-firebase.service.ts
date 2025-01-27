import { NotificationInterface, NotificationModel } from './../Bitoo/models/notifications-model';
import { Injectable } from '@angular/core';
import { AppSettings } from '../AppSettings';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';


@Injectable({
  providedIn: 'root'
})

export class NotificationWithFirebaseService {

  public url = `${AppSettings.API_ENDPOINT}`;
  constructor(
    private http: HTTP,
    private localNotifications: LocalNotifications
  ) { }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa las notificaciones, registra el token y activa recibir notificaciones
   */
  public inicialize() {
    this.inicializeToken();
    this.receiveNotification();
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa el token y lo registra
   */
  public inicializeToken() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });
    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        localStorage.setItem('nftoken', String(token.value));
      },
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa recibir notificaciones
   */
  public receiveNotification() {
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.localNotificationPush(notification);
      },
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Activa las notificaciones locales de Ionic si esta en la App en uso (por que las notificaciones de firebase con ionic solo se muestran en la barra de notificaciones si no esta en uso la App)
   * @param notification
   */
  public localNotificationPush(notification: PushNotificationSchema) {
    this.localNotifications.schedule({
      title: notification.title,
      text: notification.body,
      icon: 'https://ecoevents.blob.core.windows.net/comprandoando/bituyu/Web/LOGOTINBITOOCIRCULAR.png'
    });
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Servicio de actualiza el token para el usuario (cerrar sesión y con sesión iniciada)
   * @param contentNotification
   * @returns Observable<any>
   */
  public updateUserWithNotification(contentNotification: NotificationInterface): Observable<any> {
    const body: string = JSON.stringify(contentNotification);
    return from(this.http.post(
      this.url + 'api/notificaciones/actualizarToken', body, AppSettings.getHeadersToken()
    ).then().catch());
  }
}
