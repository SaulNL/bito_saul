import { Component, OnInit } from '@angular/core';
import {IPedidoRealizado} from '../../../interfaces/pasarelas/IPedidoRealizado';
import {TextVistaPagoModel} from '../../../Modelos/pasarelas/TextVistaPagoModel';
import {ActivatedRoute} from '@angular/router';
import {PedidosService} from '../../../api/pedidos.service';
import {AppSettings} from '../../../AppSettings';
import * as htmlToImage from 'html-to-image';
import {ToadNotificacionService} from "../../../api/toad-notificacion.service";
import html2canvas from "html2canvas";
import {Media, MediaSaveOptions} from '@capacitor-community/media';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {ModalImagenCuponComponent} from '../../../components/modal-imagen-cupon/modal-imagen-cupon.component';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-pago-realizado',
  templateUrl: './pago-realizado.page.html',
  styleUrls: ['./pago-realizado.page.scss'],
})
export class PagoRealizadoPage implements OnInit {
  public pedido: string;
  public informacionPedido: IPedidoRealizado;
  public loader = false;
  public informacionvista: TextVistaPagoModel;


  public productoDefault = AppSettings.IMG_ERROR_PRODUCTO;

  constructor(
      private route: ActivatedRoute,
      private pedidoServicio: PedidosService,
      private notificaciones: ToadNotificacionService,
      public platform: Platform
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.pedido = params.pedido;
      this.obtenerPedido();

    });
    /* this.route.queryParams
        .subscribe(params => {
              //this.pedido = params.pedido;
              // this.pedido = 'MmxkT2NIU1NDbm5Lalh3R0VNNU1adz09p';
              this.obtenerPedido();
            }
        ); */
  }


  private obtenerPedido() {

    this.informacionvista = this.procesando();
    this.pedidoServicio.obetenerDatosPedido(this.pedido).subscribe(
        resp => {
          resp = JSON.parse(resp);
          switch (resp.code) {
            case 200: {
              this.informacionvista = this.success();
              this.informacionPedido = resp.data;
              break;
            }
            case 404: {
              this.informacionvista = this.errorPay();
              this.informacionvista.desscripcion = resp.message;
              break;
            }
            case 402: {
              this.informacionvista = this.rembolso();
              this.informacionPedido = resp.data;
              this.informacionvista.desscripcion = resp.message;
              break;
            }
            default: {
              this.informacionvista = this.errorPay();
              this.informacionPedido = resp.data;
              this.informacionvista.vistaDetalle = true;
              this.informacionvista.desscripcion = resp.message;
              break;
            }
          }
        },
        error => {
          this.informacionvista = this.errorPay();
          console.error(error);
        },
        () => {
        }
    );
  }

  totalPedido() {
    let suma = 0;
    this.informacionPedido.detalle.forEach(it => {
      suma += (it.costo * it.cantidad);
    });
    return suma;
  }


  private procesando(): TextVistaPagoModel {
    return new TextVistaPagoModel(
        'Procesando...',
        'search-outline',
        'zoom-active',
        'fondo-procesando',
        'Obteniendo información del pedido',
        false
    );
  }
  private success(): TextVistaPagoModel {
    return new TextVistaPagoModel(
        'Pago Exitoso!',
        'checkmark-circle-outline',
        'giro-zoom',
        'fondo-success',
        'Pago registrado correctamente',
        true
    );
  }
  private errorPay(): TextVistaPagoModel {
    return new TextVistaPagoModel(
        'ERROR',
        'close-circle-outline',
        'giro-zoom',
        'fondo-error',
        'Ocurrió un error inesperado al generar el pago',
        false
    );
  }
  private pendeing(): TextVistaPagoModel {
    return new TextVistaPagoModel(
        'Pendiente...',
        'alert-circle-outline',
        'giro-zoom',
        'fondo-pendiente',
        'El pago del pedio se encuentra en proceso, espere un momento',
        false
    );
  }
  private rembolso(): TextVistaPagoModel {
    return new TextVistaPagoModel(
        'Reembolsado',
        'checkmark-circle-outline',
        'giro-zoom',
        'fondo-pendiente',
        'El ha sido reembolsado',
        true
    );
  }

  public descargar() {
    this.loader = true;

    html2canvas(document.querySelector('#recibo'), { allowTaint: true, useCORS : true}).then(async canvas => {

      const fileName = 'recibo_' + this.pedido + '.png';



      if ( this.platform.is('ios') ){
        const opts: MediaSaveOptions = { path: canvas.toDataURL().toString(), fileName };
        await Media.savePhoto(opts);
      } else {
        Filesystem.writeFile({
          path: fileName,
          data: canvas.toDataURL().toString(),
          directory: Directory.Documents
        }).then(() => {
          this.notificaciones.exito('Archivo guardado en galería');
          this.loader = false;
        }, error => {
          this.notificaciones.error(error);
        });
      }
    }).finally(() => {
      this.loader = false;
    });
  }
}
