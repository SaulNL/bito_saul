import { Router } from "@angular/router";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { IonContent, ModalController, ToastController } from "@ionic/angular";
import { NotificacionesService } from "../../api/usuario/notificaciones.service";
import {DetallesReservaComponent} from "../../paginas/eventos/detalles-reserva/detalles-reserva.component";
import {RecorteImagenComponent} from "../recorte-imagen/recorte-imagen.component";
import {EventosService} from "../../api/eventos.service";
import {SolicitudesService} from "../../api/solicitudes.service";
import {SolicitudesModel} from "../../Modelos/SolicitudesModel";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {FiltrosModel} from "../../Modelos/FiltrosModel";
import {ModalInfoSolicitudComponent} from "../../componentes/modal-info-solicitud/modal-info-solicitud.component";

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
  solicitud: any;
  public idProveedorUsuario: boolean = false;
  public lstSolicitudes: Array<SolicitudesModel>;
  public anyFiltros: FiltrosModel;

  constructor(
    private service: NotificacionesService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private router: Router,
    private eventosService: EventosService,
    private servicioSolicitudes: SolicitudesService,
    private _notificacionService: ToadNotificacionService,
  ) {}

  ngOnInit() {
    this.loader = true;
    this.obtenerMensajes();
    this.lstSolicitudes = new Array<SolicitudesModel>();
    this.anyFiltros = new FiltrosModel();
    this.solicitud = [];
  }

  obtenerMensajes() {
    let usuario = JSON.parse(localStorage.getItem('u_data'));
    if (usuario.proveedor) {
      this.idProveedorUsuario = this.notificacion.id_proveedor === usuario.proveedor.id_proveedor ? true : false;
    }
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

    if (this.loader) {
      this.servicioMensajes();
    } else {
      clearInterval(this.interval);

      this.interval = setInterval(() => {
        this.servicioMensajes();
      }, 5000);
    }
    this.scrollToBottom();
  }

  servicioMensajes() { 
    this.service.obtenerMensajesNotificacion(this.idRecibe, this.idEnvia, this.tipo)
    .subscribe((res) => {
      if (res.code === 200) {
        res.data.map((msj) => {
          msj.fecha = new Date(msj.fecha).toLocaleString();
        });
        this.loader = false;
        if (res.data.length != this.mensajes.length) {
          this.mensajes = res.data;
          console.log('datosMensaje', this.mensajes);
          this.obtenerMensajes();
        }
      }
    });
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
    this.toastEnviarMsj();
    this.service.guardarMensajeNotificacion(nuevoMensaje);
  }

  async toastEnviarMsj() {
    
    const toast = await this.toastController.create({
      message: 'Enviando mensaje...',
      duration: 5000,
      position: 'bottom',
      cssClass: 'toastChat'
    });

    await toast.present();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  cerrarModal() {
    clearInterval(this.interval);
    this.modalCtrl.dismiss();
  }

  infoNegocio() {
    this.cerrarModal();
    this.router.navigate(["/tabs/negocio/" + this.notificacion.url_negocio]);
  }

  async reservacion(evento: any) {
    this.cerrarModal();
    this.eventosService.setSelectedObj(evento);
    const modal = await this.modalCtrl.create({
      component: DetallesReservaComponent,
    });
    await modal.present();
  }

  requerimiento(idSolicitud: number){
    this.servicioSolicitudes.obtenerSolicitudesPublicadas(this.anyFiltros)
        .subscribe(
        (response) => {
          if (response.data !== null) {
            this.lstSolicitudes = response.data;
            this.solicitud = this.lstSolicitudes.find(p => p.id_solicitud === idSolicitud);
          } else {
            this.lstSolicitudes = [];
          }
          }, (error) => {
              this._notificacionService.error(error);
              this.lstSolicitudes = [];
            }
        );
    setTimeout(() => {
      this.cerrarModal();
      this.modalDetalleSolicitud(this.solicitud);
    }, 800);
  }

  async modalDetalleSolicitud(solicitud: any){
    const modal = await this.modalCtrl.create({
      component: ModalInfoSolicitudComponent,
      cssClass: "my-custom-class",
      componentProps: {
        solicitud: solicitud,
      },
    });
    return await modal.present();
  }
}
