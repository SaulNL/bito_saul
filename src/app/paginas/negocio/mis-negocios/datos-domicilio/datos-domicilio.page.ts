import { CatLocalidadModel } from './../../../../Modelos/CatLocalidadModel';
import { CatMunicipioModel } from './../../../../Modelos/CatMunicipioModel';
import { CatEstadoModel } from './../../../../Modelos/CatEstadoModel';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../../Modelos/NegocioModel";
import { ActionSheetController, AlertController } from "@ionic/angular";
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { NegocioService } from "../../../../api/negocio.service";
import { Map, tileLayer, marker, Marker } from 'leaflet';
import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;
import { GeneralServicesService } from './../../../../api/general-services.service';
import { UtilsCls } from './../../../../utils/UtilsCls';
import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-datos-domicilio',
  templateUrl: './datos-domicilio.page.html',
  styleUrls: ['./datos-domicilio.page.scss'],
})
export class DatosDomicilioPage implements OnInit {
  public negocioTO: NegocioModel;
  public valido: boolean;
  public negocioGuardar: any;
  private marker: Marker<any>;
  map: Map;
  public latitud: any;
  public longitud: any;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public btnEstado: boolean;
  public btnMuncipio: boolean;
  public btnLocalidad: boolean;
  public estadoAux: any;
  public municiAux: any;
  public localiAux: any;
  public loadion : any;
  public loader: boolean;
  public msj = 'Guardando';
  constructor(
    private platform: Platform,
    private router: Router,
    private active: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private negocioServico: NegocioService,
    private notificaciones: ToadNotificacionService,
    public alertController: AlertController,
    private _general_service: GeneralServicesService,
    private _utils_cls: UtilsCls,
    public loadingController: LoadingController
    ) {
    this.valido = false;
    this.negocioGuardar = new NegocioModel();
    this.latitud = 19.4166896;
    this.longitud = -98.1467336;
    this.btnEstado = false;
    this.btnMuncipio = true;
    this.btnLocalidad = true;
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
    this.loader = false;
  }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        let datos = JSON.parse(params.special);
        this.negocioTO = datos.info;
        this.negocioGuardar = datos.pys;
      }
    });
    this.cagarMapa();
    this.load_cat_estados();


  }

  datosD() {
    this.negocioGuardar.det_domicilio.calle = this.negocioTO.det_domicilio.calle;
    this.negocioGuardar.det_domicilio.numero_int = this.negocioTO.det_domicilio.numero_int;
    this.negocioGuardar.det_domicilio.numero_ext = this.negocioTO.det_domicilio.numero_ext;
    this.negocioGuardar.det_domicilio.colonia = this.negocioTO.det_domicilio.colonia;
    this.negocioGuardar.det_domicilio.id_estado = this.negocioTO.det_domicilio.id_estado;
    this.negocioGuardar.det_domicilio.id_municipio = this.negocioTO.det_domicilio.id_municipio;
    this.negocioGuardar.det_domicilio.id_localidad = this.negocioTO.det_domicilio.id_localidad;
    this.negocioGuardar.det_domicilio.colonia = this.negocioTO.det_domicilio.colonia;
    this.negocioGuardar.det_domicilio.latitud = this.negocioTO.det_domicilio.latitud;
    this.negocioGuardar.det_domicilio.longitud = this.negocioTO.det_domicilio.longitud;
    if (this.negocioTO.det_domicilio.id_domicilio != null) {
      this.negocioGuardar.det_domicilio.id_domicilio = this.negocioTO.det_domicilio.id_domicilio;
    }
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Opciones",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Editar",
          role: "save",
          handler: () => {
            this.valido = true;
          },
        },
        {
          text: "Cancel",
          icon: "close",

          handler: () => { this.valido = false; },
        },
      ],
    });
    await actionSheet.present();
  }
  regresarMis() {
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    let navigationExtras = JSON.stringify(this.negocioTO);
    this.router.navigate(["/tabs/home/negocio/card-negocio"], {
      queryParams: { special: navigationExtras },
    });
  }

  regresar() {
    this.datosD();
    this.negocioTO = JSON.parse(JSON.stringify(this.negocioTO));
    this.negocioGuardar = JSON.parse(JSON.stringify(this.negocioGuardar));
    let all = {
      info: this.negocioTO,
      pys: this.negocioGuardar
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate(["/tabs/home/negocio/mis-negocios/datos-contacto"], {
      queryParams: { special: navigationExtras },
    });
  }
  async cancelar() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estas seguro?',
      message: 'Se cancelara todo el proceso',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.router.navigate(['/tabs/home/negocio'], { queryParams: { special: true } });
          }
        }
      ]
    });

    await alert.present();
  }
  guardar() {
    this.loader = true;
    if (
      this.negocioTO.logo === null ||
      this.negocioTO.logo === undefined ||
      this.negocioTO.logo === undefined ||
      this.negocioTO.logo.archivo_64 === '' ||
      this.negocioTO.logo.archivo_64 === null ||
      this.negocioTO.logo.archivo_64 === undefined) {
      this.notificaciones.alerta('Agregue la foto de su negocio');
      this.loader = false;
    } else {
      this.datosD();
      this.negocioServico.guardar(this.negocioGuardar).subscribe(
        response => {
          if (response.code === 200) {
            this.notificaciones.exito('Tu negocio se guardo exitosamente');
            this.loader = false;
            this.router.navigate(['/tabs/home/negocio'], { queryParams: { special: true } });
          } else {
            this.notificaciones.alerta('Error al guardar, intente nuevamente');
            this.loader = false;
          }
        },
        error => {
          this.notificaciones.error(error);
          this.loader = false;
          //  this.loaderGuardar = false;
        }
      );
    }
  }
  /**
 * Funcion para cargar el mapa
 */
  public cagarMapa() {
    setTimeout(it => {
      // this.map = new Map("mapId").setView([this.latitud, this.longitud], 16);
      this.map = new Map("mapId").setView([this.latitud, this.longitud], 12);
      this.map.on('click', respuesta => {
        this.getLatLong(respuesta);
      })
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
      this.marker = marker([this.latitud, this.longitud], {
        draggable:
          true
      }).addTo(this.map);
      if (this.negocioTO.det_domicilio.latitud !== null) {
        this.localizacionTiempo(2);
      }
    }, 500);
  }
  getLatLong(e) {
    let latitude = e.latlng.lat;
    this.negocioTO.det_domicilio.latitud = latitude;
    let longitude = e.latlng.lng;
    this.negocioTO.det_domicilio.longitud = longitude;
    this.map.panTo([latitude, longitude]);
    this.marker.setLatLng([latitude, longitude]);

  }
  /**
   * Funcion para obtener la ubicacion actual
   */
  async localizacionTiempo(tipo: number) {
    let latitude;
    let longitude;
    const coordinates = await Geolocation.getCurrentPosition().then(res => {
      if (tipo === 1) {
        this.negocioTO.det_domicilio.latitud = res.coords.latitude;
        latitude = res.coords.latitude;
        this.negocioTO.det_domicilio.longitud = res.coords.longitude;
        longitude = res.coords.longitude;
        this.map.panTo([latitude, longitude]);
        this.marker.setLatLng([latitude, longitude]);
      } else {
        latitude = this.negocioTO.det_domicilio.latitud;
        longitude = this.negocioTO.det_domicilio.longitud;
        this.map.setView([latitude, longitude], 12);
        this.marker.setLatLng([latitude, longitude]);
      }
    }).catch(error => {
      this.notificaciones.error(error);
    }
    );
  }
  /**
* Funcion para obtener el estado
*/
  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_estado = response.data.list_cat_estado;
          this.list_cat_estado.forEach(element => {
            if (element.id_estado == this.negocioTO.det_domicilio.id_estado) {
              this.estadoAux = element.nombre;

            }
          });
          //this.loader = false;
          if (this.negocioTO.det_domicilio.id_estado > 0) {
            this.get_list_cat_municipio({ value: this.negocioTO.det_domicilio.id_estado });
          }
        }
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  /**
  * Funcion para obtener los municipios
  */
  public get_list_cat_municipio(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      this.negocioTO.det_domicilio.id_municipio = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderMunicipio = true;
      this._general_service.getMunicipios(idE).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_municipio = response.data.list_cat_municipio;
            this.list_cat_municipio.forEach(element => {
              if (element.id_municipio == this.negocioTO.det_domicilio.id_municipio) {
                this.municiAux = element.nombre;


              }
            });
            this.btnMuncipio = false;
            if (this.negocioTO.det_domicilio.id_municipio > 0) {
              this.btnMuncipio = false;
              this.get_list_cat_localidad({ value: this.negocioTO.det_domicilio.id_municipio });
            }
          }
        },
        error => {
          this.notificaciones.error(error);
        },
        () => {
          //  this.loaderMunicipio = false;
        }
      );
    } else {
      this.list_cat_municipio = [];
    }
  }
  /**
 * Obtener localidad
 */
  public get_list_cat_localidad(evento) {
    let idE;
    if (evento.type === 'ionChange') {
      this.negocioTO.det_domicilio.id_localidad = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderLocalidad = true;

      this._general_service.getLocalidad(idE).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.btnLocalidad = false;
            this.list_cat_localidad = response.data.list_cat_localidad;
            this.list_cat_localidad.forEach(element => {
              if (element.id_localidad == this.negocioTO.det_domicilio.id_localidad) {
                this.localiAux = element.nombre;

              }
            });
          }
        },
        error => {
          //   this._notificacionService.pushError(error);
          this.notificaciones.error(error);
        },
        () => {
          //  this.loaderLocalidad = false;
        }
      );
    } else {
      this.list_cat_localidad = [];
    }
  }
}

