import { ModalRecorteimagenPage } from './../../datos-basicos/modal-recorteimagen/modal-recorteimagen.page';
import { GeneralServicesService } from './../../../api/general-services.service';
import { Component, OnInit } from '@angular/core';
import { Map, tileLayer, marker, Marker } from 'leaflet';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { UtilsCls } from './../../../utils/UtilsCls';
import { CatEstadoModel } from 'src/app/Modelos/catalogos/CatEstadoModel';
import { CatMunicipioModel } from 'src/app/Modelos/catalogos/CatMunicipioModel';
import { CatLocalidadModel } from 'src/app/Modelos/catalogos/CatLocalidadModel';
import { ArchivoComunModel } from 'src/app/Modelos/ArchivoComunModel';
import { NgForm } from '@angular/forms';
import { SolicitudesService } from './../../../api/solicitudes.service';
import { ToadNotificacionService } from '../../../api/toad-notificacion.service';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Router, ActivatedRoute } from '@angular/router';

const { Geolocation } = Plugins;






@Component({
  selector: 'app-form-solicitud',
  templateUrl: './form-solicitud.page.html',
  styleUrls: ['./form-solicitud.page.scss'],
  providers: [
    UtilsCls
  ]
})
export class FormSolicitudPage implements OnInit {
  public actualTO: SolicitudesModel;
  map: Map;
  public latitud: any;
  public longitud: any;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public blnImgCuadrada: boolean;
  public usuario: any;
  public loader: any;
  private marker: Marker<any>;
  constructor(
    private _general_service: GeneralServicesService,
    private _utils_cls: UtilsCls,
    private solicitudesService: SolicitudesService,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.latitud = 19.4166896;
    this.longitud = -98.1467336;
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.actualTO = JSON.parse(params.special);
      }
    });
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
    this.load_cat_estados();
    this.cagarMapa();
    this.blnImgCuadrada = true;
    this.blnImgCuadrada = !(this.actualTO.url_imagen !== undefined);
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  regresar(){
    this.router.navigate(['/tabs/home/solicitudes'], { queryParams: { special: true } });
  }
  /**
   * Funcion para guardar los datos
   * @param form
   * @author Omar
   */
  guardar(form: NgForm) {

    if ((this.actualTO.imagen === undefined || this.actualTO.imagen === null)
      && (this.actualTO.url_imagen === undefined || this.actualTO.url_imagen === '')) {
      this.notificaciones.alerta('La imagen para tarjeta de la promoción es requerida');
      return;
    }
    if (form.valid) {
      this.presentLoading();
      this.actualTO.id_persona = this.usuario.id_persona;
      if (this.actualTO.id_giro === 12) {
        this.actualTO.id_categoria = 9999;
      }
      this.solicitudesService.guardar(this.actualTO).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.loader.dismiss();
            this.notificaciones.exito('Los datos se guardaron correctamente');
            form.resetForm();
            this.regresar();
          }
          // this.notificaciones.alerta(response.message + ',' + response.code);
        },
        error => {
          this.loader.dismiss();
          this.notificaciones.error(error);
        }
      );
    } else {
      this.notificaciones.alerta('Es requerido que llenes todos los campos obligatorios');
    }

  }

  /**
   * Funcion para cargar el mapa
   */
  public cagarMapa() {
    setTimeout(it => {
      this.map = new Map("mapId").setView([this.latitud, this.longitud], 16).on('click', this.getLatLong);
     // this.map = new Map("mapId").setView([this.latitud, this.longitud], 16);
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(this.map);
      this.marker = marker([this.latitud, this.longitud], {
        draggable:
          true
      }).addTo(this.map);
      if (this.actualTO.det_domicilio.latitud !== null) {
        this.localizacionTiempo(2);
      }
    }, 500);
  }

  /**
 * Funcion para obtener el estado
 */
  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_estado = response.data.list_cat_estado;
          //this.loader = false;
          if (this.actualTO.det_domicilio.id_estado > 0) {
            this.get_list_cat_municipio({ value: this.actualTO.det_domicilio.id_estado });
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
            if (this.actualTO.det_domicilio.id_municipio > 0) {
              this.get_list_cat_localidad({ value: this.actualTO.det_domicilio.id_municipio });
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
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderLocalidad = true;

      this._general_service.getLocalidad(idE).subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_localidad = response.data.list_cat_localidad;
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
  /**
     * Funcion para obtener la ubicacion actual
     */
  async localizacionTiempo(tipo: number) {
    let latitude;
    let longitude;
    const coordinates = await Geolocation.getCurrentPosition().then(res => {
      if (tipo === 1) {
        this.actualTO.det_domicilio.latitud = res.coords.latitude;
        latitude = res.coords.latitude;
        this.actualTO.det_domicilio.longitud = res.coords.longitude;
        longitude = res.coords.longitude;
        this.map.setView([latitude, longitude], 16);
        this.marker.setLatLng([latitude, longitude]);
      } else {
        latitude = this.actualTO.det_domicilio.latitud;
        longitude = this.actualTO.det_domicilio.longitud;
        this.map.setView([latitude, longitude], 16);
        this.marker.setLatLng([latitude, longitude]);
      }
    }).catch(error => {
      this.notificaciones.error(error);
    }
    );
  }
  
  getLatLong(e) {
    console.log(e);
   let latitude = e.latlng.lat;
   let longitude = e.latlng.lng;
    console.log(latitude);
    console.log(longitude);
   // this.map.setView([latitude, longitude], 16);
   // this.marker.setLatLng([latitude, longitude]);

  }
  /************************************************************
   * IMAGENES
   ***********************************************************/
  /**
   * Funcion para abrir el selector de imagen
   * @param event
   * @param modal
   */
  public subir_imagen_cuadrada(event) {
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;
            if (width === 200 && height === 200) {
              //   this.procesando_img = true;
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then(
                  data => {
                    file_64 = data;
                    const imagen = new ArchivoComunModel();
                    imagen.nombre_archivo = this._utils_cls.convertir_nombre(file_name);
                    imagen.archivo_64 = file_64;
                    this.actualTO.imagen = imagen;
                    //   this.procesando_img = false;
                    this.blnImgCuadrada = false;
                  }
                );
              } else {
                this.notificaciones.alerta('El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo');
              }
            } else {
              this.abrirModal(event);
            }
          };
        };
      }
    }
  }
  async abrirModal(event) {
    const modal = await this.modalController.create({
      component: ModalRecorteimagenPage,
      cssClass: 'my-custom-class',
      componentProps: {
        eventoImagen: event,
        width: 400,
        height: 400,
        IdInput: 'cuadrado',
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != null) {
      this.guardarImagenRecortada(data.data, data.nombre_archivo);
    }
  }
  guardarImagenRecortada(data, nombre_archivo) {
    const file_name = nombre_archivo;
    const file = data;
    const imagen = new ArchivoComunModel();
    if (file_name != null) {
      imagen.nombre_archivo = file_name,
        imagen.archivo_64 = file;
      this.blnImgCuadrada = false;
    }
    this.actualTO.imagen = imagen;
  }
}
