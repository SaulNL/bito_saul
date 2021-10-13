import { Auth0Service } from './../../api/busqueda/auth0.service';
import { AfiliacionPlazaModel } from './../../Modelos/AfiliacionPlazaModel';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PromocionesService } from '../../api/busqueda/proveedores/promociones.service';
import { IonSlides } from '@ionic/angular';
import { PromocionesModel } from '../../Modelos/busqueda/PromocionesModel';
import { NavBarServiceService } from '../../../app/api/busqueda/nav-bar-service.service';
import { Router } from '@angular/router';
import { UbicacionModel } from './../../Modelos/busqueda/UbicacionModel';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-banner-promociones',
  templateUrl: './banner-promociones.component.html',
  styleUrls: ['./banner-promociones.component.scss'],
})
export class BannerPromocionesComponent implements OnInit {
  @Input() anyFiltros: any;
  @Input() tieneFiltro: any;
  filtro: any;
  lstPromociones: any;
  public lstAvisos: any;
  promocionDefault: any;
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  @ViewChild('mySlider') slides: IonSlides;
  public promocion: PromocionesModel;
  public urlNegocio: string;
  public numeroVistas: number;
  public miUbicacionlatitud: number;
  public miUbicacionlongitud: number;
  public ubicacion = new UbicacionModel();
  private plazaAfiliacion: AfiliacionPlazaModel;
  constructor(
    private servicioPromociones: PromocionesService,
    private navBarServiceService: NavBarServiceService,
    private _router: Router,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private autho: Auth0Service
  ) {
    this.lstPromociones = [];
    this.lstAvisos = [];
  }
  ngOnInit() {
    this.obtenerGeolocalizacion();
    this.obtenerPromociones(this.anyFiltros);
    this.obtenerAvisos();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Información',
      message: 'Esta imagen es solo informativa',
      buttons: ['Cerrar']
    });

    await alert.present();
  }
  swipeNext() {
    this.slides.slideNext();
  }
  swipePrev() {
    this.slides.slidePrev();
  }
  /**
   * Funcion para obtener mi ubicacion actual
   * @author Omar
   */
  public obtenerGeolocalizacion() {
    this.geolocation.getCurrentPosition().then((reponse) => {
      this.miUbicacionlatitud = reponse.coords.latitude;
      this.miUbicacionlongitud = reponse.coords.longitude;



    }).catch((error) => {

    });
  }
  /**
     * Funcion para obtener las promociones
     * @author Omar
     */
  public obtenerPromociones(filtro: any) {
    if(!this.tieneFiltro){
      filtro.strBuscar='';
      filtro.intEstado = null;
      filtro.strMunicipio = null;
        filtro.kilometros = 10;
        filtro.latitud = 0;
        filtro.longitud = 0;
        filtro.idTipoNegocio = null;
        filtro.blnEntrega = null;
        filtro.idGiro = null;
        filtro.idCategoriaNegocio = null;
        filtro.idEstado = null;
        filtro.idMunicipio = null;
        filtro.idLocalidad = null;
        filtro.abierto = null;
        filtro.tipoBusqueda = 0;
        filtro.id_persona = null;
    }
    this.plazaAfiliacion = JSON.parse(localStorage.getItem('org'));
    if (this.plazaAfiliacion != null) {
      filtro.organizacion = this.plazaAfiliacion.id_organizacion;
    }
    this.servicioPromociones.buscarPromocinesPublicadasFiltros(filtro).subscribe(
      response => {
        this.lstPromociones = response.data;
        //this.loaderPromo = false;
      },
      error => {
        // this._notificacionService.pushError(error);
      }
    );
  }
  /**
   * Funcion para obtener avisos
*/
  public obtenerAvisos() {
    // this.loaderPromo = true;
    this.servicioPromociones.obtenerAvisos(this.autho.getIdPersona()).subscribe(
      response => {
        this.lstAvisos = response.data;
        // this.loaderPromo = false;
      },
      error => {
        //this._notificacionService.pushError(error);
      }
    );
  }
  /**
  * funcion para obtener la informacion de las promociones
  * @param promocion
  * @author Omar
  */
  accionPromocion(promocion) {
    this.urlNegocio = 'tabs/negocio/' + promocion.url_negocio;
    this.promocion = promocion;
    this.visteMiPromocion(promocion);
    this.quienNumeroVioPublicacion(promocion.id_promocion);
    this.rutaLink(this.urlNegocio);
    setTimeout(() => {
      this.navBarServiceService.promocionSeleccionada(promocion);
    }, 1500);
  }
  /**
* Funcion para guardar el quien vio la promocion
* @param promocion
* @author Omar
*/
  visteMiPromocion(promocion: PromocionesModel) {
    this.ubicacion.latitud = this.miUbicacionlatitud;
    this.ubicacion.longitud = this.miUbicacionlongitud;
    this.servicioPromociones.guardarQuienVioPromocion(promocion, this.ubicacion).subscribe(
      response => {
        if (response.code === 200) {
        }
      },
      error => {
      }
    );
  }
  /**
 * funcion para obtener el detalle de quien ha visto la publicacion
 * @param id_promocion
 * @autor Omar
 */
  quienNumeroVioPublicacion(id_promocion) {
    this.servicioPromociones.obtenerNumeroQuienVioPublicacion(id_promocion).subscribe(
      response => {
        this.numeroVistas = response.data;
      },
      error => {
      }
    );
  }
  /**
  * Funcion para enlazar a otra pagina
  * @param ruta
  * @author Omar
  */
  rutaLink(ruta: string) {
    //this._router.navigateByUrl('#' + ruta, { skipLocationChange: true });
    setTimeout(() => this._router.navigate([ruta]));
  }

}
