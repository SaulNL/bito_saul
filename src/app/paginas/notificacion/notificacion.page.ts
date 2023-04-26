import { Component, OnInit } from '@angular/core';
import {NotificacionesModel} from '../../Modelos/NotificacionesModel';
import {Auth0Service} from '../../api/auth0.service';
import {UtilsCls} from '../../utils/UtilsCls';
import {NotificacionService} from '../../api/NotificacionService';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.page.html',
  styleUrls: ['./notificacion.page.scss'],
  providers: [Auth0Service],
})
export class NotificacionPage implements OnInit {

  public lstNotificaciones: Array<NotificacionesModel>;
  public noti: NotificacionesModel;
  public numNotifiSinLeer: number;
  public user: any;
  public loader: boolean;
  constructor(
      private _auth0: Auth0Service,
      private _utilsCls: UtilsCls,
      public notificacionService: NotificacionService
  ) {  }

  ngOnInit() {
    if (this._utilsCls.existe_sesion()){
      this.user = this._auth0.getUserData();
    }
    this.lstNotificaciones = new Array<NotificacionesModel>();
    this.noti = new NotificacionesModel();
    this.numNotifiSinLeer = 0;
    this.loader = false;
    this.obtenerNotificaciones();
  }

  public obtenerNotificaciones() {
    this.loader = true;
    this.notificacionService.obtenerNotificaciones(this.user.proveedor.id_proveedor).subscribe(
        response => {
          if (response.code === 200) {
            this.lstNotificaciones = response.data;
            this.obtenerNotiSinLeer();
          }
          this.loader = false;
        });
  }

  public obtenerNotiSinLeer(){
    this.numNotifiSinLeer = this.lstNotificaciones.filter(item => {
      return item.estatus === 1;
    }).length;
  }


}
