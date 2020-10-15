import { Component, OnInit } from '@angular/core';
import { PromocionesService } from '../../api/promociones.service';
import {LoadingController} from "@ionic/angular";
/* Modelos */
import { PromocionesModel } from '../../Modelos/PromocionesModel';
import { FiltrosModel } from '../../Modelos/FiltrosModel';

@Component({
  selector: 'app-tab2',
  templateUrl: 'promociones.page.html',
  styleUrls: ['promociones.page.scss']
})
export class PromocionesPage implements OnInit {

  private loaderPrincipal: HTMLIonLoadingElement;
  public lstPromociones: Array<PromocionesModel>;
  public anyFiltros    : FiltrosModel;
  public loader        : boolean = false;


  constructor(private _promociones: PromocionesService,  public loadingController: LoadingController ) {
    
  }

  ngOnInit(): void {
    this.loader = true;
    this.anyFiltros = new FiltrosModel();
    this.lstPromociones = new Array<PromocionesModel>();
    this.anyFiltros.kilometros = 1;
    this.anyFiltros.idEstado = 29;
    this.obtenerPromociones();
  }

  public obtenerPromociones() {
    if (navigator.geolocation && this.anyFiltros.tipoBusqueda === 1) {
      navigator.geolocation.getCurrentPosition(posicion => {
        this.anyFiltros.latitud = posicion.coords.latitude;
        this.anyFiltros.longitud = posicion.coords.longitude;
        this.obtenerPromocionesServicio();
      });
    } else {
      this.anyFiltros.tipoBusqueda = 0;
      this.obtenerPromocionesServicio();
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
        message: 'Cargando. . .',
        duration: 5000
    });
    return await loading.present();
  }

  public obtenerPromocionesServicio() {
    this.presentLoading().then(a => {});
    this._promociones.buscarPromocinesPublicadasModulo(this.anyFiltros).subscribe(
      response => {
        if(response.code === 402){
          console.log('402');
          this.loaderPrincipal.onDidDismiss();
        }
        if (response.data !== null) {
          this.lstPromociones = response.data;
          this.loader = false;
          this.loaderPrincipal.onDidDismiss();
         // if(this.anyFiltros.strBuscar !== ""){this.modalMapBuscador()}
        } else {
          this.lstPromociones = [];
          this.loaderPrincipal.onDidDismiss();
        }
      },
      error => {
        console.error(error);
        this.lstPromociones = [];
        this.loaderPrincipal.onDidDismiss();
      },
      () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    );
  }
}
