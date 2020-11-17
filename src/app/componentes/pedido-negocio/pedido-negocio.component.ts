import {Component, Input, OnInit} from '@angular/core';
import {UtilsCls} from "../../utils/UtilsCls";
import {ModalController} from "@ionic/angular";
import {icon, Map, Marker, marker, tileLayer} from "leaflet";
import {Geolocation} from "@capacitor/core";
import {NegocioService} from "../../api/negocio.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";

declare var google: any;

@Component({
  selector: 'app-pedido-negocio',
  templateUrl: './pedido-negocio.component.html',
  styleUrls: ['./pedido-negocio.component.scss'],
  providers: [ UtilsCls]
})
export class PedidoNegocioComponent implements OnInit {

  @Input() public _entregaDomicilio: any;
  @Input() public _entregaSitio: any;
  @Input() public _consumoSitio: any;
  @Input() lista: any;
  tipoEnvio: any;
  private map: Map;
  public lat: any;
  public lng: any;
  public blnUbicacion: boolean;
  public estasUbicacion: any;
  private marker: Marker<any>;
  suma: number;
  sumaTotal: number;

  constructor(
      private utilsCls: UtilsCls,
      private modalController: ModalController,
      private negocioService : NegocioService,
      private mesajes: ToadNotificacionService
  ) {
    this.lat = 19.31905;
    this.lng = -98.19982;
  }

  ngOnInit() {
    if (this._entregaDomicilio === 1){
      this.tipoEnvio =  2;
    }else {
      this.tipoEnvio = null;
    }
    console.log(this._entregaDomicilio,this._entregaSitio, this._consumoSitio)
    this.getCurrentPosition();
    this.sumarLista();

  }

  loadMap() {
    const lat = this.lat;
    const lng = this.lng;
    this.map = new Map("mapIdPedido").setView([lat, lng], 16);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: ''}).addTo(this.map);

    var myIcon = icon({
      iconUrl: 'https://ecoevents.blob.core.windows.net/comprandoando/marker.png',
      iconSize: [45, 41],
      iconAnchor: [13, 41],
    });


    this.marker = marker([lat, lng], {icon: myIcon}).addTo(this.map)
  }

  cerrarModal() {
    this.modalController.dismiss({
      data: this.lista
    });
  }

  eliminar() {

  }

  private getCurrentPosition() {
     Geolocation.getCurrentPosition().then(res => {
      this.blnUbicacion = true;
      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;
      this.loadMap()
      try {
        this.geocodeLatLng();
      } catch (e) {
        console.error(e);
      }
    }).catch(error => {
          console.log(error, 'asdasdsad');
          this.blnUbicacion = false;
        }
    );
  }

  public geocodeLatLng() {
    const geocoder = new google.maps.Geocoder;
    const latlng = {
      lat: parseFloat(String(this.lat)),
      lng: parseFloat(String(this.lng))
    };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.estasUbicacion = results[0].formatted_address;
        } else {
        }
      } else {
      }
    });
  }

  public realizarPedido() {
    const pedido = {
      direccion: this.estasUbicacion,
      idNegocio: this.lista[0].idNegocio,
      idPersona: this.utilsCls.getIdPersona(),
      idTipoPedido: this.tipoEnvio,
      latitud: this.lat,
      longitud: this.lng,
      pedido: this.lista
    };

    this.negocioService.registrarPedido(pedido).subscribe(
        res => {
          this.mesajes.exito('Pedido realizado éxito')
          this.lista = [];
          this.cerrarModal();
        },error => {
          this.mesajes.error('Ocurrio un error al generar el pedido')
        }
    )
  }

  private sumarLista() {
    this.suma = 0
    this.sumaTotal = 0
    this.lista.map(it => {
      this.suma = this.suma + (it.precio * it. cantidad)
    })
    this.sumaTotal = this.suma

    if (this.tipoEnvio === 2){
      this.sumaTotal  = this.sumaTotal + 30
    }

  }

  cambiarTipo() {
    this.sumarLista();
  }
}
