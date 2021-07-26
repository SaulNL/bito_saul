import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MsNegocioModel } from 'src/app/Modelos/busqueda/MsNegocioModel';
import { ProveedorServicioService } from './../../api/busqueda/proveedores/proveedor-servicio.service';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-calificar-negocio',
  templateUrl: './calificar-negocio.component.html',
  styleUrls: ['./calificar-negocio.component.scss'],
})
export class CalificarNegocioComponent implements OnInit {
  @Input() public actualTO: MsNegocioModel;
  public numeroEstrellas: number;
  public comentarioCalificacion: string;
  public loader: any;


  constructor(
    private modalController: ModalController,
    private serviceProveedores: ProveedorServicioService,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController
  ) {
  }

  ngOnInit() {
    this.comentarioCalificacion = '';
    this.numeroEstrellas = 0;
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  valorEstrella() {
    const estrella = <any>document.getElementsByName('estrella');
    for (let i = 0; i < estrella.length; i++) {
      if (estrella[i].checked) {
        this.numeroEstrellas = estrella[i].value;
      }
    }
  }
  /**
 * Funcion para enviar la calificacion del negocio
 * @author Omar
 */
  enviarCalificacion() {
    this.valorEstrella();
    if(this.numeroEstrellas > 1 || this.comentarioCalificacion !== ''){
    this.presentLoading();
    this.actualTO.calificacion = this.numeroEstrellas;
    this.actualTO.comentario = this.comentarioCalificacion;
    this.serviceProveedores.enviarCalificacionNegocio(this.actualTO).subscribe(
      response => {
        if (response.code === 200) {
          this.notificaciones.exito(response.message);
          this.loader.dismiss();
          //  this.estatusCalificacion = true;
          this.actualTO.numCalificaciones = response.data.numCalificaciones;
          this.actualTO.promedio = response.data.promedio;
          this.modalController.dismiss({
            'numCalificaciones': this.actualTO.numCalificaciones,
            'promedio': this.actualTO.promedio
          });
         // this.cerrarModal();
        }
      },
      error => {
        this.notificaciones.error(error);
        this.loader.dismiss();
      });
    }else{
      this.notificaciones.alerta('Para poder calificar este negocio, necesitas seleccionar una estrella ó realizar un comentario');
    }
  }
}
