import { Component, OnInit } from "@angular/core";
import { NotificacionesService } from "../../api/usuario/notificaciones.service";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { NotificacionChatComponent } from "../../components/notificacion-chat/notificacion-chat.component";
import { NotificacionesModel } from "src/app/Modelos/NotificacionesModel";

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
  notificaciones: Array<NotificacionesModel>;
  intervalNotificaciones: any;

  constructor(
    private notificacionService: NotificacionesService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loader = true;
    this.notificaciones = [];
    this.usuario = JSON.parse(localStorage.getItem('u_data'));

    this.obtenerNotificaciones();
  }

  obtenerNotificaciones() {
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
      this.intervalNotificaciones = setInterval(() => {
        this.servicioNotificaciones();
      }, 3000);
    }
  }

  servicioNotificaciones(){
    this.notificacionService.obtenerNotificaciones(this.idProveedor, this.idPersona).subscribe(
      response => {
        if (response.code === 200){
          this.loader = false;
          if (response.data.length != this.notificaciones.length) {
            this.notificaciones= response.data;
            this.obtenerNotificaciones();
          }
          
        }
      },
      error => {
      }
    );
  }

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
    this.router.navigate(["/tabs/home/perfil"]);
  }
}
