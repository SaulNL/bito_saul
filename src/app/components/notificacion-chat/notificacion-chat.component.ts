import { Router } from "@angular/router";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { IonContent, ModalController } from "@ionic/angular";
import { NotificacionesService } from "../../api/usuario/notificaciones.service";

@Component({
  selector: "app-notificacion-chat",
  templateUrl: "./notificacion-chat.component.html",
  styleUrls: ["./notificacion-chat.component.scss"],
})
export class NotificacionChatComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  @Input() notificacion: any;

  tipo: number;
  loader: boolean;
  idEnvia: number;
  idRecibe: number;
  mensajes: any[] = [];
  mensajeEnviar: string = "";
  interval: any;

  constructor(
    private service: NotificacionesService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.obtenerMensajes();
  }

  obtenerMensajes() {
    this.loader = true;
    this.idEnvia = null;
    this.idRecibe = null;

    if (this.notificacion.id_negocio_envia === null) {
      this.tipo = 1;
      this.idEnvia = this.notificacion.id_persona_envia;
      this.idRecibe = this.notificacion.id_negocio_recibe;
    } else {
      this.tipo = 2;
      this.idEnvia = this.notificacion.id_negocio_envia;
      this.idRecibe = this.notificacion.id_persona_recibe;
    }

    this.interval = setInterval(() => {

      this.service.obtenerMensajesNotificacion(this.idRecibe, this.idEnvia, this.tipo)
      .subscribe((res) => {
        if (res.code === 200) {
          res.data.map((msj) => {
            msj.fecha = new Date(msj.fecha).toLocaleString();
          });

          if (res.data.length != this.mensajes.length) {
            this.mensajes = res.data;
            this.scrollToBottom();
          }
        }
      });
    }, 2000);
  }

  enviarMensaje() {
    if (!this.mensajeEnviar.trim()) return;

    let nuevoMensaje = {
      mensaje: this.mensajeEnviar,
      id_negocio_envia: this.tipo === 1 ? this.idRecibe : null,
      id_negocio_recibe: this.tipo === 2 ? this.idEnvia : null,
      id_persona_envia: this.tipo === 2 ? this.idRecibe : null,
      id_persona_recibe: this.tipo === 1 ? this.idEnvia : null,
    };

    this.mensajeEnviar = "";

    this.service.guardarMensajeNotificacion(nuevoMensaje);
  }

  pushMensaje(msg: any) {
    msg.remitente = 0;

    if (msg.id_persona_envia === this.idRecibe || msg.id_negocio_envia === this.idRecibe) {
      this.mensajes.push(msg);
    } 
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
    clearInterval(this.interval)
  }

  infoNegocio() {
    this.cerrarModal();
    this.router.navigate(["/tabs/negocio/" + this.notificacion.url_negocio]);
  }
}
