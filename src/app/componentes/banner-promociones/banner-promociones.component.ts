import { Auth0Service } from './../../api/busqueda/auth0.service';
import { AfiliacionPlazaModel } from './../../Modelos/AfiliacionPlazaModel';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PromocionesService } from '../../api/busqueda/proveedores/promociones.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { PromocionesModel } from '../../Modelos/busqueda/PromocionesModel';
import { NavBarServiceService } from '../../../app/api/busqueda/nav-bar-service.service';
import { Router } from '@angular/router';
import { UbicacionModel } from './../../Modelos/busqueda/UbicacionModel';
import { AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RegistrarPromotionService } from "../../api/registrar-promotion.service";
import { NegocioService } from 'src/app/api/negocio.service';
import { ModalPromocionNegocioComponent } from '../modal-promocion-negocio/modal-promocion-negocio.component';
import { icon, Map, Marker, marker, tileLayer } from 'leaflet';
import { UtilsCls } from 'src/app/utils/UtilsCls';


@Component({
  selector: 'app-banner-promociones',
  templateUrl: './banner-promociones.component.html',
  styleUrls: ['./banner-promociones.component.scss'],
})
export class BannerPromocionesComponent implements OnInit {
  @Input() afi: boolean;
  @Input() anyFiltros: any;
  @Input() tieneFiltro: any;
  @Input() soloAnuncios: boolean;
  filtro: any;
  lstPromocionesAnuncios: any;
  lstAvisos: any;
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
  private map: Map;
  public miLat = null;
  public miLng = null;
  private marker: Marker<any>;
  public user: any;
  public modalBanner: boolean;
  @ViewChild('mapContainer') mapContainer: Map;

  constructor(
    private servicioPromociones: PromocionesService,
    private navBarServiceService: NavBarServiceService,
    private _router: Router,
    public alertController: AlertController,
    private geolocation: Geolocation,
    private autho: Auth0Service,
    private vioPromo: RegistrarPromotionService,
    private negocioService: NegocioService,
    public modalController: ModalController,
    private util: UtilsCls,
  ) {
    this.lstPromocionesAnuncios = [];
    this.lstAvisos = [];
    this.user = this.util.getUserData();
    this.modalBanner = false;
  }

  ngOnInit() {
    this.obtenerGeolocalizacion();
    this.obtenerPromocionesAnuncios(this.anyFiltros);
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
  public obtenerPromocionesAnuncios(filtro: any) {
    if (!this.tieneFiltro) {
      filtro.strBuscar = '';
      filtro.intEstado = 0;
      filtro.strMunicipio = "";
      filtro.typeGetOption = true;
      filtro.kilometros = null;
      filtro.latitud = 0;
      filtro.longitud = 0;
      filtro.idTipoNegocio = null;
      filtro.blnEntrega = null;
      filtro.idGiro = null;
      filtro.idCategoriaNegocio = null;
      filtro.idEstado = 29;
      filtro.idMunicipio = null;
      filtro.idLocalidad = null;
      filtro.abierto = null;
      filtro.tipoBusqueda = 0;
      filtro.id_persona = null;
      filtro.organizacion = null;
    }
    this.plazaAfiliacion = JSON.parse(localStorage.getItem('org'));
    if (this.plazaAfiliacion != null) {
      filtro.organizacion = this.plazaAfiliacion.id_organizacion;
    }

    if (this.soloAnuncios) {
      this.servicioPromociones.buscarAnunciosPublicadosFiltros(this.user.id_persona).subscribe(response => {
        this.lstPromocionesAnuncios = response.data;
      })
    } else {
      this.servicioPromociones.buscarPromocinesPublicadasFiltros(filtro).subscribe(response => {
        this.lstPromocionesAnuncios = response.data;
      });
    }
  }
  /**
   * Funcion para obtener avisos
*/
  public obtenerAvisos() {
    this.servicioPromociones.obtenerAvisos(this.autho.getIdPersona()).subscribe(
      response => {
        this.lstAvisos = response.data;
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
    this.modalBanner = true;
    this.promocion = promocion;
    if (this.map) {
      try {
        this.map.remove();
      } catch (error) {
        console.log(error)
      }
    }
    this.masInformacion(promocion);
    this.visteMiPromocion(promocion);
    this.quienNumeroVioPublicacion(promocion.id_promocion);
    //this.rutaLink(this.urlNegocio);
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
    this.vioPromo.registrarQuienVio(promocion.id_promocion, this.autho.getExistIdPersona(), this.ubicacion.latitud, this.ubicacion.longitud);

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
    setTimeout(() => this._router.navigate([ruta]));
  }


  masInformacion(promocion: any) {
    let promo = promocion.id_promocion;
    this.loadMap(promocion.latitud,promocion.longitud)
    this.infoPromocionSelect(promocion.url_negocio,promocion.id_promocion);
    // this._router.navigate(['/tabs/negocio/' + promocion.url_negocio], {
    //   queryParams: { route: true, clickBanner: true, promo: promo }
    // });


  }

  infoPromocionSelect(negocio,idPromocion) {
    this.negocioService.obteneretalleNegocio(negocio, this.user.id_persona).subscribe((response) => {
      let promocionSelect = response.data.promociones.find(res => res.id_promocion == idPromocion);
      if (promocionSelect) {
        this.abrirModalPromocion(promocionSelect, null,this.user.id_persona)
      }
        }
        );
  }

  async abrirModalPromocion(promo: any, idPromo: any,idPersona) {  // aQUI SE ABRE MODAL DE PROMO
    localStorage.setItem('modalPromo', idPromo);
    this.modalBanner = false;
    const modal = await this.modalController.create({
      component: ModalPromocionNegocioComponent,
      componentProps: {
        promocionTO: promo,
        idPersona: idPersona,
        latitud: this.miLat,
        longitud: this.miLng,
        celular: promo.celular,
        descripcion: promo.descripcion,

      },
    });
    modal.present();
  }

  async loadMap(lt, lg) {
    const lat = lt;
    const lng = lg;
    setTimeout((it) => {
      this.map = new Map('mapIdPedido').setView([lat, lng], 14);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '',
      }).addTo(this.map);
      this.map.on('', (respuesta) => {
        this.getLatLong(respuesta);
      });
      const myIcon = icon({
        iconUrl:
          'https://ecoevents.blob.core.windows.net/comprandoando/marker.png',
        iconSize: [45, 41],
        iconAnchor: [13, 41],
      });
      this.marker = marker([lat, lng], { icon: myIcon, draggable: false }).addTo(
        this.map
      );
    }, 500);
  }

  getLatLong(e) {
    this.miLat = e.latlng.lat;
    this.miLng = e.latlng.lng;
    this.map.panTo([this.miLat, this.miLng]);
    this.marker.setLatLng([this.miLat, this.miLng]);
  }

}
