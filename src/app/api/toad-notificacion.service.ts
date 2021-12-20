import { Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToadNotificacionService {

  constructor(
    private toadController: ToastController
  ) { }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Muestra mensaje exito
   * @param message
   */
  public success(message: any) {
    this.exito(message);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Muestra mensaje de alerta
   * @param message
   */
  public alert(message: any) {
    this.alerta(message);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Muestra mensaje de error
   * @param message
   */
  public error(message: any) {
    this.configToad('danger', message);
  }

  public exito(mensaje) {
    this.configToad('success', mensaje);
  }

  public alerta(mensaje) {
    this.configToad('warning', mensaje);
  }

  async configToad(color, mensaje) {
    const toast = await this.toadController.create({
      color: color,
      duration: 2000,
      message: mensaje
    });
    return await toast.present();
  }

}
