import { Component, Input, OnInit } from '@angular/core';
import { UtilsCls } from "../../utils/UtilsCls";
import { AlertController, ModalController } from "@ionic/angular";
import { icon, Map, Marker, marker, tileLayer } from "leaflet";
import { Geolocation } from "@capacitor/core";
import { NegocioService } from "../../api/negocio.service";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";

declare var google: any;

@Component({
  selector: 'app-pedido-negocio',
  templateUrl: './pedido-negocio.component.html',
  styleUrls: ['./pedido-negocio.component.scss'],
  providers: [UtilsCls]
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
  cantidad: number;
  //detalle:string;
  constructor(
    private utilsCls: UtilsCls,
    private modalController: ModalController,
    private negocioService: NegocioService,
    private mesajes: ToadNotificacionService,
    public alertController: AlertController,
  ) {
    this.lat = 19.31905;
    this.lng = -98.19982;
  }

  ngOnInit() {
    if (this._entregaDomicilio === 1) {
      this.tipoEnvio = 2;
    } else {
      this.tipoEnvio = null;
    }
    this.loadMap();
    this.getCurrentPosition();
    this.sumarLista();
  }

  loadMap() {
    setTimeout(it => {
      const lat = this.lat;
      const lng = this.lng;
      this.map = new Map("mapIdPedido").setView([lat, lng], 14);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
      this.map.on('click', respuesta => {
        this.getLatLong(respuesta);
      });
      var myIcon = icon({
        iconUrl: 'https://ecoevents.blob.core.windows.net/comprandoando/marker.png',
        iconSize: [45, 41],
        iconAnchor: [13, 41],
      });
      this.marker = marker([lat, lng], { icon: myIcon }).addTo(this.map);
    }, 500);
  }

  cerrarModal() {
    this.modalController.dismiss({
      data: this.lista
    });
  }

  eliminar(index) {
    this.lista.pop(index);
    this.sumarLista();
    if (this.suma === 0) {
      this.lista = [];
      this.cerrarModal();
    }
  }

  private getCurrentPosition() {
    Geolocation.getCurrentPosition().then(res => {
      this.blnUbicacion = true;
      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;
      try {
        this.geocodeLatLng();
      } catch (e) {
        console.error(e);
      }
    }).catch(error => {
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
      //detalle: this.detalle
    };
    console.log(pedido);
    this.negocioService.registrarPedido(pedido).subscribe(
      res => {
        this.mesajes.exito('Pedido realizado éxito')
        this.lista = [];
        this.cerrarModal();
      }, error => {
        this.mesajes.error('Ocurrio un error al generar el pedido')
      }
    );
  }

  private sumarLista() {
    this.suma = 0
    this.sumaTotal = 0
    this.lista.map(it => {
      this.suma = this.suma + (it.precio * it.cantidad)
    })
    this.sumaTotal = this.suma

    if (this.tipoEnvio === 2) {
      this.sumaTotal = this.sumaTotal + 30
    }

  }

  cambiarTipo(evento) {
    this.tipoEnvio = parseInt(evento.detail.value);
    this.sumarLista();
    if (this.tipoEnvio === 2) {
      setTimeout(it => {
        this.loadMap();
      }, 500);
    }
  }
  /**
    * Funcion para obtener la ubicacion actual
    */
  async localizacionTiempo(tipo: number) {
    let latitude;
    let longitude;
    const coordinates = await Geolocation.getCurrentPosition().then(res => {
      if (tipo === 1) {
        //  this.actualTO.det_domicilio.latitud = res.coords.latitude;
        this.lat = res.coords.latitude;
        //   this.actualTO.det_domicilio.longitud = res.coords.longitude;
        this.lng = res.coords.longitude;
        this.map.setView([this.lat, this.lng], 14);
        this.marker.setLatLng([this.lat, this.lng]);
        this.geocodeLatLng();
      }
    }).catch(error => {
      //   this.notificaciones.error(error);
    }
    );
  }
  getLatLong(e) {
    this.lat = e.latlng.lat;
    this.lng = e.latlng.lng;
    this.map.setView([this.lat, this.lng], 14);
    this.marker.setLatLng([this.lat, this.lng]);
    this.geocodeLatLng();
  }

  aumentarDismuir(cantidad: number, index: number, operacion: number) {
    let valor = this.lista[index].cantidad;
    if (operacion === 1 && cantidad >= 1) {
      this.lista[index].cantidad = ++valor;
      this.sumarLista();
    }
    if (operacion === 2 && cantidad > 1) {
      this.lista[index].cantidad = --valor;
      this.sumarLista();
    }
  }
  async presentAlertConfirm(i) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Esta seguro que desa Eliminar?',
      message: 'Recuerde que la acción es ireversible',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          role: 'destructive',
          text: 'Confirmar',
          handler: () => {
            this.eliminar(i);
          }
        }
      ]
    });
    await alert.present();
  }
}
