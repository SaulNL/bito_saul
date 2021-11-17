import { AppSettings } from './../../../../AppSettings';
import { CommonOneSignalModel } from './../../../../Modelos/OneSignalNotificationsModel/CommonOneSignalModel';
import { NegocioService } from './../../../../api/negocio.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SentPushNotificationService } from './../../../../api/sent-push-notification.service';
import { PedidosService } from '../../../../api/pedidos.service';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { SentNotificationModel } from './../../../../Modelos/OneSignalNotificationsModel/SentNotificationModel';

@Component({
  selector: 'app-datos-pedido-dialog',
  templateUrl: './datos-pedido-dialog.page.html',
  styleUrls: ['./datos-pedido-dialog.page.scss'],
})
export class DatosPedidoDialogPage implements OnInit {
  public pedido: any;
  blnCancelar: boolean;
  motivo: any;
  public total: number;
  public domicilioEnvio: boolean;
  public domicilioEnvioMessage: any;
  public idNegocio: string;
  constructor(
    private pedidosServicios: PedidosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificaciones: ToadNotificacionService,
    public alertController: AlertController,
    private negocioService: NegocioService,
    private sentPushNotificationService: SentPushNotificationService
  ) {
    this.total = 0;
    this.domicilioEnvio = false;
    this.domicilioEnvioMessage = '';
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        const body = JSON.parse(params.special);
        this.pedido = body.pedido;
        this.idNegocio = body.negocio.id_negocio;
        this.pedido.productos.forEach(element => {
          this.total += Number(element.costo);
        });
        if (this.pedido.id_tipo_pedido === 2) {
          this.domicilioEnvio = true;
          this.textoDomicilio(body.negocio.precioEntrega);
        }
      }
    });
  }
  cancelar() {
    this.blnCancelar = true;
  }
  btnRegresar() {
    this.blnCancelar = false;
  }
  regresar() {
    this.router.navigate(['/tabs/home/compras'], { queryParams: { special: true } });
  }
  cancelarPedido(pedido: any) {
    //this.loaderBtn = true;
    this.pedidosServicios.cancelarUsuario(pedido.id_pedido_negocio, this.motivo).subscribe(
      respuesta => {
        //this.loaderBtn = false;
        pedido.id_estatus_pedido = respuesta.data.id;
        pedido.estatus = respuesta.data.estatus;
        pedido.color = respuesta.data.color;
        pedido.motivo = respuesta.data.motivo;
        this.sendNotification(this.idNegocio, this.motivo);
        this.notificaciones.exito(respuesta.message);
      },
      error => {
        //this.loaderBtn = false;
        this.notificaciones.error(error.message);
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Información',
      message: 'para cancelar este pedido, es necesario escribir el motivo de la cancelación',
      buttons: ['Cerrar']
    });
    await alert.present();
  }
  validarMotivoCancelacion(pedido: any) {
    if (this.motivo) {
      this.cancelarPedido(pedido);
    } else {
      this.presentAlert();
    }
  }
  public textoDomicilio(domicilioEnvioMessage: any) {
    const temp = Number(domicilioEnvioMessage);
    if (isNaN(temp)) {
      this.domicilioEnvioMessage = '+ Costo de envio : ' + domicilioEnvioMessage;
    } else {
      this.domicilioEnvioMessage = '+ $' + temp + 'pesos del envio';
    }
  }

  private sendNotification(idNegocio: string, motivo: string) {
    this.negocioService.obtenerIdUsuarioByNegocio(idNegocio).subscribe(
      response => {
        this.sentPushNotificationService.getTkn().subscribe(
          res => {
            let content = new CommonOneSignalModel('El pedido fue cancelado por el usuario por el motivo de : ' + motivo);
            let headings = new CommonOneSignalModel('Pedido Cancelado');
            let sentNotification = new SentNotificationModel(content, headings, [String(response.data.usuario)], res.data.api); /* Produccion */
            this.sentPushNotificationService.sentNotification(sentNotification, res.data.tkn).subscribe( /* Produccion */
              () => {
                this.blnLoaderFalse();
              }, () => {
                this.blnLoaderFalse();
              }
            );
          }, () => {
            this.blnLoaderFalse();
          }
        );
      }, () => {
        this.blnLoaderFalse();
      }
    );
  }
  private blnLoaderFalse() {
    this.blnCancelar = false;
  }


}
