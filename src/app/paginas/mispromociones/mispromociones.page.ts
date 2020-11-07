import { Component, OnInit, ViewChild } from '@angular/core';
import { PromocionesModel } from '../../Modelos/PromocionesModel';
import { PromocionesService } from '../../api/promociones.service';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { AlertController, IonContent } from '@ionic/angular';
import { PublicacionesModel } from '../../Modelos/PublicacionesModel';
import { ModalController } from '@ionic/angular';
import { ModalPublicarComponent } from 'src/app/components/modal-publicar/modal-publicar.component';
import { QuienVioModel } from '../../Modelos/QuienVioModel';
import { ModalInfoPromoComponent } from '../../components/modal-info-promo/modal-info-promo.component';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-mispromociones',
  templateUrl: './mispromociones.page.html',
  styleUrls: ['./mispromociones.page.scss'],
})
export class MispromocionesPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public seleccionTO: PromocionesModel;
  public agregarPromocion: boolean;
  public seleccionaPromocion: boolean;
  public accionFormulario: string;
  public usuario: any;
  public id_proveedor: any;
  public lstPromocionesPublicadas: Array<PromocionesModel>;
  public promocion: PromocionesModel;
  public loader = false;
  public btnBlockedNuevo = false;
  public lstPromociones: Array<PromocionesModel>;
  public lstPromocionesBK: Array<PromocionesModel>;
  public publicacionesHechas: number;
  public publicacionesPermitidas:number;
  public lstPromocionesPublicadasBK: Array<PromocionesModel>;
  public blnActivarFormularioEdicion: boolean;
  public filtro: any;
  public btnDetallePromocion: boolean;
  public mensajePublicacion = false;
  public blnSelectFecha = false;
  public publicacion: PublicacionesModel;
  public fechas: string;
  public fi: Date;
  public ff: Date;
  public cadena = "";
  public lstQuienVioPublicacionActiva: false;
  public btnLoaderModal = false;
  public lstQuienVioPublicacion: Array<QuienVioModel>;
  public numeroVisto: number;

  constructor(
              private _promociones_service: PromocionesService,
              public _notificacionService: ToadNotificacionService,
              private  alertController: AlertController,
              public modalController: ModalController,
              private _router: Router,
              private active: ActivatedRoute
            ) { 

            }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.publicacionesHechas = 0;
    this.publicacionesPermitidas = 0;
    this.lstPromocionesPublicadas = new Array<PromocionesModel>();
    this.lstQuienVioPublicacion = new Array<QuienVioModel>();
    this.lstQuienVioPublicacionActiva = false;
    this.seleccionTO = new PromocionesModel();
    this.promocion = new PromocionesModel();
    this.blnActivarFormularioEdicion = false;
    this.buscar();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.buscar();
        }
      }
    });
  }

  agregar() {
    this.seleccionTO = new PromocionesModel();
    let navigationExtras = JSON.stringify(this.seleccionTO);
    this._router.navigate(['/tabs/home/promociones/agregar-promocion'], { queryParams: {special: navigationExtras}});
  }

  buscar() {
    this.seleccionaPromocion = false;
    this.btnDetallePromocion = false;
    this.agregarPromocion = false;
    this.cancelarEdicion();
    this.loader = true;
    this.seleccionTO.id_proveedor = this.usuario.proveedor.id_proveedor;
    this._promociones_service.buscar(this.seleccionTO).subscribe(
      response => {
        this.lstPromociones = response.data;
        this.lstPromocionesBK = response.data;
        this.filtro = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.obtenerNumeroPublicacionesPromocion();
        this.obtenerPromocionesPublicadas();
      },
      error => {
        this._notificacionService.error(error);
        this.loader = false;
      }
    );
  }

  public cancelarEdicion() {
    this.agregarPromocion = false;
    this.seleccionaPromocion = false;
    this.btnBlockedNuevo = false;
    this.btnDetallePromocion = false;
  }

  obtenerNumeroPublicacionesPromocion(){
    this._promociones_service.obtenerNumeroPublicacionesPromocion(this.id_proveedor).subscribe(
      response => {
        this.publicacionesHechas = response.data.numPublicacionesPromo;
        this.publicacionesPermitidas = response.data.numPubliPromoPermitidas;
        this.loader = false;
      },
      error => {
        this._notificacionService.error(error);
        this.loader = false;
      }
    );
  }

  public obtenerPromocionesPublicadas(){
    this.loader = true;
    this._promociones_service.obtenerPromocinesPublicadas(this.seleccionTO).subscribe(response => {
        this.lstPromocionesPublicadas = response.data;
        this.lstPromocionesPublicadasBK = response.data;
        this.loader = false;
      },
      error => {
        this._notificacionService.error(error);
        this.loader = false;
      });
  }

  public seleccionarPromocion(promocion: PromocionesModel){
    this.promocion = promocion;
    let navigation = JSON.stringify(this.promocion);
    this._router.navigate(['/tabs/home/promociones/publicar-promocion'], { queryParams: {especial: navigation}});
  }

  btnBuscar() {
    this.lstPromocionesPublicadas = this.lstPromocionesPublicadasBK;
    this.lstPromocionesPublicadas = this.lstPromocionesPublicadas.filter(element => {
      return element.nombre_comercial.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1
        || element.promocion.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1;
    });
  }

  public modificar(seleccionTO: PromocionesModel) {
    this.btnBlockedNuevo = true;
    this.agregarPromocion = true;
    this.btnDetallePromocion = false;
    this.seleccionaPromocion = true;
    this.seleccionTO = seleccionTO;
    this.accionFormulario = 'Modificar Promocion';
  }

  public preguntaEliminar(variable: PromocionesModel) {
    this.seleccionTO = variable;
    this.seleccionTO.id_promocion = variable.id_promocion;
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
    this._promociones_service.eliminar(this.seleccionTO).subscribe(
      response => {
        this.buscar();
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
    if (data.data.id_proveedor !== undefined && data.data.id_proveedor !== null) {
      console.log(data);
      this.buscar();
    }
  }

  dejar( publicada: any ){
    this.seleccionTO = publicada;
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dejar de publicar',
      subHeader: '!Precaución! esta acción no podrá ser revertida',
      message: `¿Desea dejar de publicar esta publicación de la promoción: ${ this.seleccionTO.promocion }?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('cancelar');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.quitarPublicacionPromocion();
          }
        }
      ]
    });

    await alert.present();
  }

  quitarPublicacionPromocion(){
    this._promociones_service.quitarPublicacionPromocion(this.seleccionTO).subscribe(
      response => {
        this.buscar();
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

  public abrirModalDetalle(id_promocion, estatus) {
    this.lstQuienVioPublicacionActiva = estatus;
    this.quienVioPublicacion(id_promocion);
  }

  quienVioPublicacion(id_promocion){
    this.btnLoaderModal = true;
    this._promociones_service.obtenerQuienVioPublicacion(id_promocion, this.usuario.id_persona).subscribe(
        response => {
          this.lstQuienVioPublicacion = response.data;
          this.quienNumeroVioPublicacion(id_promocion);
        },
        error => {
        }
    );
  }

  quienNumeroVioPublicacion(id_promocion){
    this._promociones_service.obtenerNumeroQuienVioPublicacion(id_promocion).subscribe(
        response => {
          this.numeroVisto = response.data;
          this.btnLoaderModal = false;
          this.infoPromocion();
        },
        error => {
        }
    );
  }

  async infoPromocion() {
    const modal = await this.modalController.create({
      component: ModalInfoPromoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'lstQuienVioPublicacion': this.lstQuienVioPublicacion,
        'lstQuienVioPublicacionActiva': this.lstQuienVioPublicacionActiva,
        'btnLoaderModal': this.btnLoaderModal,
        'numeroVisto': this.numeroVisto
      }
    });
    return await modal.present();
  }

  regresar(){
    this._router.navigateByUrl('tabs/home/perfil');
  }

}
