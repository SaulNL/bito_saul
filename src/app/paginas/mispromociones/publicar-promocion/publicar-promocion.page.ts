import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromocionesModel } from '../../../Modelos/PromocionesModel';
import { PromocionesService } from '../../../api/promociones.service';
import { ToadNotificacionService } from '../../../api/toad-notificacion.service';
import { PublicacionesModel } from '../../../Modelos/PublicacionesModel';
import { ModalController } from '@ionic/angular';
import { ModalPublicarComponent } from 'src/app/components/modal-publicar/modal-publicar.component';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-publicar-promocion',
  templateUrl: './publicar-promocion.page.html',
  styleUrls: ['./publicar-promocion.page.scss'],
})
export class PublicarPromocionPage implements OnInit {

  public seleccionTo: PromocionesModel;
  public publicacionesHechas: number;
  public id_proveedor: any;
  public usuario: any;
  public publicacionesPermitidas:number;
  public mensajePublicacion = false;
  public blnSelectFecha = false;
  public publicacion: PublicacionesModel;
  public fechas: string;
  public fi: Date;
  public ff: Date;

  constructor( private route: ActivatedRoute,
               private _promociones_service: PromocionesService,
               public _notificacionService: ToadNotificacionService,
               public modalController: ModalController,
               public alertController: AlertController,
               public router: Router
              ) { 
    this.seleccionTo = new PromocionesModel();
  }

  ngOnInit() {
    this.route.queryParams.subscribe( params => {
      if (params && params.especial) {
        this.seleccionTo = JSON.parse( params.especial );
      }
    });
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.publicacionesHechas = 0;
    this.publicacionesPermitidas = 0;
    this.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.fechas = '';
    this.fi = null;
    this.ff = null;
    this. obtenerNumeroPublicacionesPromocion();
  }

  obtenerNumeroPublicacionesPromocion(){
    this._promociones_service.obtenerNumeroPublicacionesPromocion(this.id_proveedor).subscribe(
      response => {
        this.publicacionesHechas = response.data.numPublicacionesPromo;
        this.publicacionesPermitidas = response.data.numPubliPromoPermitidas;
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

  public abrirModal(Promocion: PromocionesModel) {

    if (this.publicacionesHechas >= this.publicacionesPermitidas){
      this.mensajePublicacion = true;
    }

    this.blnSelectFecha = false;
    this.publicacion = new PublicacionesModel();
    this.publicacion.id_promocion = Promocion.id_promocion;
    this.publicacion.id_negocio = Promocion.id_negocio;
    this.fechas = '';
    this.fi = null;
    this.ff = null;
    this.publicarPromocion();
  }

  async publicarPromocion() {
    const modal = await this.modalController.create({
      component: ModalPublicarComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'publicacion': this.publicacion,
        'mensajePublicacion': this.mensajePublicacion,
        'publicacionesPermitidas': this.publicacionesPermitidas
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  public cancelarEdicion() {
    this.router.navigate(['/tabs/home/promociones'], { queryParams: {special: true}  });
  }

  public modificar(actualTo: PromocionesModel) {
    this.seleccionTo = actualTo;
    let navigationExtras = JSON.stringify(this.seleccionTo);
    this.router.navigate(['/tabs/home/promociones/agregar-promocion'], { queryParams: {special: navigationExtras}});
  }

  public preguntaEliminar(variable: PromocionesModel) {
    this.seleccionTo = variable;
    this.seleccionTo.id_promocion = variable.id_promocion;
    this.alerta();
  }

  async alerta() {
    const alert = await this.alertController.create({
      header: 'Esta apunto de eliminar la promoción',
      message: '¿Desea continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('cancelar');
          }
        },
        {
          text: 'Eliminar',
          handler: (data) => {
            this.eliminar();
          }
        }
      ]
    });

    await alert.present();
  }

  public eliminar() {
    this._promociones_service.eliminar(this.seleccionTo).subscribe(
      response => {
        this.router.navigate(['/tabs/home/promociones'], { queryParams: {special: true}  });
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

}
