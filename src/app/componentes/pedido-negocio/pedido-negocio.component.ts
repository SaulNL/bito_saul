import { Component, Input, OnInit } from '@angular/core';
import { UtilsCls } from "../../utils/UtilsCls";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { icon, Map, Marker, marker, tileLayer } from "leaflet";
import { NegocioService } from "../../api/negocio.service";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { AuthGuardService } from "../../api/auth-guard.service";
import { Geolocation } from '@ionic-native/geolocation/ngx';
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
  @Input() public _costoEntrega: any;
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
  costoEntrega: number;
  detalle: string;
  blnCosto: boolean;
  blnCostoLetra: boolean;
  public subscribe;
  public modal;
  public loader: any;
  public msj = 'Realizando pedido';

  constructor(
    private utilsCls: UtilsCls,
    private modalController: ModalController,
    private negocioService: NegocioService,
    private mesajes: ToadNotificacionService,
    public alertController: AlertController,
    private platform: Platform,
    private guard: AuthGuardService,
    private geolocation: Geolocation
  ) {
    this.lat = 19.31905;
    this.lng = -98.19982;
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.cerrarModal();
      this.loader = false;
    });
  }

  ngOnInit() {
    this.validarCosto();
    if (this._entregaDomicilio === 1) {
      this.tipoEnvio = 2;
    } else {
      this.tipoEnvio = null;
    }

    this.loadMap();
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
      this.marker = marker([lat, lng], { icon: myIcon, draggable: true }).addTo(this.map);
      this.marker.on("dragend", () => {

        this.getLatLong({ latlng: this.marker.getLatLng() });
      });
    }, 500);
  }

  cerrarModal() {
    this.modalController.dismiss({
      data: this.lista
    });
  }

  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  eliminar(index) {
    this.lista.pop(index);
    this.sumarLista();
    if (this.suma === 0) {
      this.lista = [];
      this.cerrarModal();
      this.guard.tf = true;
    }
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
    const datos = JSON.parse(localStorage.getItem('u_data'));
    const telefono_usuario = datos.celular;
    this.loader = true;
    const pedido = {
      direccion: this.estasUbicacion,
      idNegocio: this.lista[0].idNegocio,
      idPersona: this.utilsCls.getIdPersona(),
      idTipoPedido: this.tipoEnvio,
      latitud: this.lat,
      longitud: this.lng,
      pedido: this.lista,
      detalle: this.detalle
    };
    if (this.tipoEnvio !== null) {
      this.negocioService.registrarPedido(pedido).subscribe(
        res => {
          this.mesajes.exito('Pedido realizado éxito')
          this.lista = [];
          this.guard.tf = true;
          this.cerrarModal();
        }, error => {
          this.loader = false;
          this.mesajes.error('Ocurrio un error al generar el pedido')
        },
        () => {
          this.negocioService.enviarMensajePedido(telefono_usuario, this.lista[0].idNegocio).subscribe(
            respuesta => {
              if (respuesta.code === 500) {
                this.mesajes.error(respuesta.message);
              }
            }
          );
          this.loader = false;
        }
      );
    } else {
      this.loader = false;
      this.presentAlert("Debe seleccionar el Tipo de Entrega");
    }


  }

  private sumarLista() {
    this.suma = 0
    this.sumaTotal = 0
    this.lista.map(it => {
      this.suma = this.suma + (it.precio * it.cantidad)
    })
    this.sumaTotal = this.suma

    if (this.tipoEnvio === 2) {
      if (this.blnCosto === false) {
        this.costoEntrega = 0;
      }
      this.sumaTotal = this.sumaTotal + this.costoEntrega;
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
  async localizacionTiempo() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude
      this.lng = resp.coords.longitude
      this.map.panTo([this.lat, this.lng]);
      this.marker.setLatLng([this.lat, this.lng]);
      this.geocodeLatLng();
    }).catch((error) => {

    });

  }
  getLatLong(e) {
    this.lat = e.latlng.lat;
    this.lng = e.latlng.lng;
    this.map.panTo([this.lat, this.lng]);
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
      header: '¿Esta seguro que desea Eliminar?',
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
  async presentAlert(texto: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      message: texto,
      buttons: ['OK']
    });

    await alert.present();
  }
  validarCosto() {
    if (parseInt(this._costoEntrega) >= 0) {
      this.costoEntrega = parseInt(this._costoEntrega);
      this.blnCosto = true;
      this.blnCostoLetra = false;
    } else {
      this.blnCosto = false;
      this.blnCostoLetra = true;
    }
  }
  async presentAlertCancelar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Esta seguro que desea cancelar tu pedido ?',
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
            this.cancelarPedido();
          }
        }
      ]
    });
    await alert.present();
  }
  cancelarPedido() {
    this.lista = [];
    this.guard.tf = true;
    this.cerrarModal();
  }
  public productoImagen(imagen: any) {
    if (Array.isArray(imagen)) {
      return imagen[0];
    }
    return imagen;
  }
}
