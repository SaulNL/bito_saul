import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToadNotificacionService {

  constructor(
      private toadController: ToastController
  ) { }
  public exito(mensaje){
    this.configToad('success',mensaje)
  }
  public alerta(mensaje){
    this.configToad('warning',mensaje)
  }
  public error(mensaje){
    this.configToad('danger',mensaje)
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
