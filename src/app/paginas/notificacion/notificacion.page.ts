import { Component, OnInit } from "@angular/core";
import { NotificacionesService } from "../../api/usuario/notificaciones.service";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { NotificacionChatComponent } from "../../components/notificacion-chat/notificacion-chat.component";

@Component({
  selector: "app-notificacion",
  templateUrl: "./notificacion.page.html",
  styleUrls: ["./notificacion.page.scss"],
})
export class NotificacionPage implements OnInit {
  loader: boolean;
  usuario: any;
  idPersona: number;
  idProveedor: number;
  notificaciones: any[] = [];
  intervalNotificaciones: any;
  interval: any;

  constructor(
    private notificacionService: NotificacionesService,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loader = true;
    this.notificaciones = [];
    this.usuario = JSON.parse(localStorage.getItem('u_data'));

    this.interval = setInterval(() => {
      this.notificaciones = JSON.parse(localStorage.getItem('notificaciones'))
      this.loader = false;
    }, 10000); //Se le agrego 10 segundos para que se actualicen las notificaciones

    //this.obtenerNotificaciones();
  }

  ionViewWillLeave(){
   clearInterval(this.interval);
  }

  /* obtenerNotificaciones() {
    this.idProveedor = null;
    this.idPersona = null;

    if (this.usuario.proveedor) {
      this.idProveedor = this.usuario.proveedor.id_proveedor;
      this.idPersona = this.usuario.proveedor.id_persona;
    } else {
      this.idPersona = this.usuario.id_persona;
    }

    if (this.loader) {
      this.servicioNotificaciones();
    } else {
      clearInterval(this.intervalNotificaciones);

      this.intervalNotificaciones = setInterval(() => {
        this.servicioNotificaciones();
      }, 2000);
    }
  }

  servicioNotificaciones() {
    this.notificacionService.obtenerNotificaciones(this.idProveedor, this.idPersona).subscribe(
      response => {
        if (response.code === 200) {
          this.loader = false;

          if (response.data.length != this.notificaciones.length) {
            this.obtenerNotificaciones();
          }
          this.notificaciones = response.data;
        }
      },
      error => {
      }
    );
  } */

  async abrirChat(notificacion) {
    const modal = await this.modalCtrl.create({
      component: NotificacionChatComponent,
      componentProps: {
        notificacion: notificacion,
      },
    });
    modal.present();
  }

  cerrar() {
    clearInterval(this.intervalNotificaciones);
    this.router.navigate(["/tabs/home"]);
  }
}
