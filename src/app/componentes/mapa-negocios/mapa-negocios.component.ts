import { GeneralServicesService } from './../../api/general-services.service';
import { Component, Input, OnInit } from '@angular/core';
import { Map, tileLayer, marker, Marker, icon } from 'leaflet';
import { AppSettings } from 'src/app/AppSettings';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mapa-negocios',
  templateUrl: './mapa-negocios.component.html',
  styleUrls: ['./mapa-negocios.component.scss'],
})
export class MapaNegociosComponent implements OnInit {
  map: Map;
  public marker: Marker<any>;
  public latitud: any;
  public longitud: any;
  @Input() public listaIds: Array<any>;
  public lstNegocios: Array<any>;
  url = `${AppSettings.URL_MOVIL}`;
  public iconoMarker: string;
  public urlNegocio: string;
  constructor(
    private _generalService: GeneralServicesService,
    private notificaciones: ToadNotificacionService,
    public modalController: ModalController
  ) {
    this.latitud = 19.31905;
    this.longitud = -98.19982;
  }

  ngOnInit() {
    this.cagarMapa();
    // this.getListaNegocios();
  }
  /**
   * Funcion para cargar el mapa
   */
  public cagarMapa() {
    setTimeout(it => {
      this.map = new Map("mapaId").setView([this.latitud, this.longitud], 10);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: ''}).addTo(this.map);
      this.getListaNegocios();
    }, 500);
  }
  getListaNegocios() {
    this._generalService.obtenerNegocios(this.listaIds).subscribe(
      response => {
        this.lstNegocios = response.data;
        if (this.lstNegocios.length > 0) {
          this.marcadoresNegocios();
        }
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  marcadoresNegocios() {
    for (let i = 0; i < this.lstNegocios.length; i++) {
      if (this.lstNegocios[i].url_icon !== null && this.lstNegocios[i].url_icon !== '' && this.lstNegocios[i].url_icon !== undefined) {
        this.iconoMarker = this.lstNegocios[i].url_icon;
      } else {
        this.iconoMarker = 'assets/leaflet/marker_bitoo.png';
      }
      if (this.lstNegocios[i].url_negocio !== null && this.lstNegocios[i].url_negocio !== '' && this.lstNegocios[i].url_negocio !== undefined) {
        this.urlNegocio = this.url + this.lstNegocios[i].url_negocio;
      } else {
        this.urlNegocio = this.url;
      }
      marker([this.lstNegocios[i].latitud, this.lstNegocios[i].longitud], {
        icon: icon({
          iconSize: [45, 41],
          iconAnchor: [13, 41],
          iconUrl:  this.iconoMarker,
          shadowUrl: 'assets/leaflet/marker-shadow.png'
        })
      }).addTo(this.map).bindPopup("<strong>" + this.lstNegocios[i].nombre_comercial + "</strong>" + "<br>"
          + "<a href=" + this.urlNegocio + ">" + "Ver más</a>" + "<br>"
          + "<img src=" + this.lstNegocios[i].url_logo + " width='100' height='80'>");
    }
  }
 cerrarModal(){
  this.modalController.dismiss();
 }
}
