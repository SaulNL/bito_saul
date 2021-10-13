import { Injectable, EventEmitter } from '@angular/core';
import {OneSignal, OSNotification, OSNotificationPayload} from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushServiceService {

  public userId: string;

  constructor(private oneSignal: OneSignal) { }

  /**
   * Configuracion inicial de oneSignal
   * @author Omar
   */
    configOneSignal(){
    /**
     * Credenciales Oficiales de onseSignal y Firebase proyect
     */
    this.oneSignal.startInit('cee71173-dc07-420b-a135-d716baca3baf', '923911532405');
    /**
     * Meccnismo de notificacion
     */
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    /**
     * Evento cuando la notificacion es recivida
     */
    this.oneSignal.handleNotificationReceived().subscribe(async (response) => {
      console.log('Notificacion recibida', response);
      await this.notificacionRecibida(response);
    });
    /**
     * Evento cuando la notificacion es abierta
     */
    this.oneSignal.handleNotificationOpened().subscribe(async (response) => {
      console.log('Notificacion abierta', response);
      await this.notificacionRecibida(response.notification);
    });
    /**
     * Obtener el id de la notificacion
     */
    this.oneSignal.getIds().then(response =>{
      this.userId = response.userId;
    });
    /**
     * Iniciando notificacion
     */
    this.oneSignal.endInit();
  }
  /**
   * Funcion para cachar notificacion de cada evento
   * @param noti
   * @author Omar
   */
  async notificacionRecibida(noti: OSNotification){
    const payload = noti.payload;
    await console.log('Notificacion', payload);
  }
}
