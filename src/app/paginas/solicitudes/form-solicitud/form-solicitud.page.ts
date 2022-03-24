import { ArchivoComunModel } from "./../../../Modelos/ArchivoComunModel";
import { CatLocalidadModel } from "./../../../Modelos/CatLocalidadModel";
import { CatMunicipioModel } from "./../../../Modelos/CatMunicipioModel";
import { CatEstadoModel } from "./../../../Modelos/CatEstadoModel";
import { SolicitudesModel } from "./../../../Modelos/SolicitudesModel";
import { GeneralServicesService } from "./../../../api/general-services.service";
import { Component, OnInit } from "@angular/core";
import { Map, tileLayer, marker, Marker } from "leaflet";
import { UtilsCls } from "./../../../utils/UtilsCls";
import { NgForm } from "@angular/forms";
import { SolicitudesService } from "./../../../api/solicitudes.service";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { LoadingController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import { Router, ActivatedRoute } from "@angular/router";
import { RecorteImagenComponent } from "../../../components/recorte-imagen/recorte-imagen.component";
import { NegocioService } from "../../../api/negocio.service";
import { UbicacionMapa } from '../../../api/ubicacion-mapa.service';

const { Geolocation } = Plugins;
@Component({
  selector: "app-form-solicitud",
  templateUrl: "./form-solicitud.page.html",
  styleUrls: ["./form-solicitud.page.scss"],
  providers: [UtilsCls],
})
export class FormSolicitudPage implements OnInit {
  public actualTO: any;
  map: Map;
  public latitud: any;
  public longitud: any;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public blnImgCuadrada: boolean;
  public usuario: any;
  private marker: Marker<any>;
  public tags = [];
  public btnEstado: boolean;
  public btnMuncipio: boolean;
  public btnLocalidad: boolean;
  public tipoNegoAux: any;
  public tipoGiroAux: any;
  public tipoSubAux: any;
  public tipoOrg: any;
  public listTipoNegocio: any;
  public listCategorias: any;
  public listaSubCategorias: any;
  public resizeToWidth: number = 0;
  public resizeToHeight: number = 0;
  public imageChangedEvent: any = "";
  public estaAux: any;
  public muniAux: any;
  public locaAux: any;
  public data: any;
  public loader: boolean;
  public cargando = "Guardando";
  public lstOrganizaciones: any;
  public mostrarAfiliacion: boolean;

  constructor(
    private _general_service: GeneralServicesService,
    private _utils_cls: UtilsCls,
    private solicitudesService: SolicitudesService,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private negocioServico: NegocioService,
    public getCoordinatesMap: UbicacionMapa,
  ) {
    this.usuario = JSON.parse(localStorage.getItem("u_data"));
    this.latitud = 19.4166896;
    this.longitud = -98.1467336;
    this.btnEstado = false;
    this.btnMuncipio = true;
    this.btnLocalidad = true;
    this.loader = false;
  }
  ngOnInit() {
    this.obtenerTipoNegocio();
    this.obtenerCatOrganizaciones();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
        this.actualTO = JSON.parse(params.special);
        this.obtenerTipoNegocio();
        this.obtenerCatOrganizaciones();
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
  regresar() {
    this.router.navigate(["/tabs/home/solicitudes"], {
      queryParams: { special: true },
    });
  }
  agregarTags(tags: any) {
    this.tags = tags;
    this.actualTO.tags = this.tags;
  }
  /**
   * Funcion para guardar los datos
   * @param form
   * @author Omar
   */
  guardar(form: NgForm) {
    this.loader = true;
    if (
      (this.actualTO.imagen === undefined || this.actualTO.imagen === null) &&
      (this.actualTO.url_imagen === undefined ||
        this.actualTO.url_imagen === "")
    ) {
      this.notificaciones.alerta(
        "La imagen para tarjeta de la promoción es requerida"
      );
      return;
    }
    if (form.valid) {
      this.actualTO.id_persona = this.usuario.id_persona;
      if (this.actualTO.id_giro === 12) {
        this.actualTO.id_categoria = 9999;
      }

      this.solicitudesService.guardar(this.actualTO).subscribe(
        (response) => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.loader = false;
            this.notificaciones.exito("Los datos se guardaron correctamente");
            form.resetForm();
            this.regresar();
          }
          // this.notificaciones.alerta(response.message + ',' + response.code);
        },
        (error) => {
          this.loader = false;
          this.notificaciones.error(error);
        }
      );
    } else {
      this.notificaciones.alerta(
        "Es requerido que llenes todos los campos obligatorios"
      );
    }
  }

  /**
   * Funcion para cargar el mapa
   */
  public cagarMapa() {
    setTimeout((it) => {
      // this.map = new Map("mapId").setView([this.latitud, this.longitud], 16);
      this.map = new Map("mapId").setView([this.latitud, this.longitud], 16);
      this.map.on("click", (respuesta) => {
        this.getLatLong(respuesta);
      });
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "",
      }).addTo(this.map);
      this.marker = marker([this.latitud, this.longitud], {
        draggable: true,
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
      (response) => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_estado = response.data.list_cat_estado;
          this.list_cat_estado.forEach((element) => {
            if (element.id_estado == this.actualTO.det_domicilio.id_estado) {
              this.estaAux = element.nombre;
            }
          });
          //this.loader = false;
          if (this.actualTO.det_domicilio.id_estado > 0) {
            this.get_list_cat_municipio({
              value: this.actualTO.det_domicilio.id_estado,
            });
          }
        }
      },
      (error) => {
        this.notificaciones.error(error);
      }
    );
  }
  /**
   * Funcion para obtener los municipios
   */
  public get_list_cat_municipio(evento) {
    let idE;
    if (evento.type === "ionChange") {
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderMunicipio = true;
      this._general_service.getMunicipiosAll(idE).subscribe(
        (response) => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_municipio = response.data.list_cat_municipio;
            this.list_cat_municipio.forEach((element) => {
              if (
                element.id_municipio == this.actualTO.det_domicilio.id_municipio
              ) {
                this.muniAux = element.nombre;
              }
            });
            this.btnMuncipio = false;
            if (this.actualTO.det_domicilio.id_municipio > 0) {
              this.btnMuncipio = false;
              this.get_list_cat_localidad({
                value: this.actualTO.det_domicilio.id_municipio,
              });
            }
          }
        },
        (error) => {
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
    if (evento.type === "ionChange") {
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderLocalidad = true;

      this._general_service.getLocalidadAll(idE).subscribe(
        (response) => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.btnLocalidad = false;
            this.list_cat_localidad = response.data.list_cat_localidad;
            this.list_cat_localidad.forEach((element) => {
              if (
                element.id_localidad == this.actualTO.det_domicilio.id_localidad
              ) {
                this.locaAux = element.nombre;
              }
            });
          }
        },
        (error) => {
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
    const coordinates = await Geolocation.getCurrentPosition()
      .then((res) => {
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
      })
      .catch((error) => {
        this.notificaciones.error(error);
      });
  }
  getLatLong(e) {
    let latitude = e.latlng.lat;
    let longitude = e.latlng.lng;
    this.map.setView([latitude, longitude], 16);
    this.marker.setLatLng([latitude, longitude]);
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
    let nombre_archivo;
    if (event.target.files && event.target.files.length) {
      let height;
      let width;
      for (const archivo of event.target.files) {
        const reader = this._utils_cls.getFileReader();
        reader.readAsDataURL(archivo);
        reader.onload = () => {
          nombre_archivo = archivo.name;
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            height = img.naturalHeight;
            width = img.naturalWidth;
            if (width === 500 && height === 500) {
              //   this.procesando_img = true;
              const file_name = archivo.name;
              const file = archivo;
              if (file.size < 3145728) {
                let file_64: any;
                const utl = new UtilsCls();
                utl.getBase64(file).then((data) => {
                  file_64 = data;
                  const imagen = new ArchivoComunModel();
                  archivo.nombre_archivo =
                    this._utils_cls.convertir_nombre(file_name);
                  archivo.archivo_64 = file_64;
                  this.actualTO.imagen = archivo;
                  //   this.procesando_img = false;
                  this.blnImgCuadrada = false;
                });
              } else {
                this.notificaciones.alerta(
                  "El tama\u00F1o m\u00E1ximo de archivo es de 3 Mb, por favor intente con otro archivo"
                );
              }
            } else {
              this.resizeToWidth = 500;
              this.resizeToHeight = 500;
              this.abrirModal(
                img.src,
                this.resizeToWidth,
                this.resizeToHeight
              ).then((r) => {
                if (r !== undefined) {
                  const archivo = new ArchivoComunModel();
                  (archivo.nombre_archivo = nombre_archivo),
                    (archivo.archivo_64 = r.data);
                  this.actualTO.imagen = archivo;
                  this.blnImgCuadrada = false;
                }
              });
            }
          };
        };
      }
    }
  }
  async abrirModal(evento, width, heigh) {
    const modal = await this.modalController.create({
      component: RecorteImagenComponent,
      cssClass: "my-custom-class",
      componentProps: {
        imageChangedEvent: evento,
        resizeToWidth: width,
        resizeToHeight: heigh,
        IdInput: "cuadrado",
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss().then((r) => {
      return r;
    });
    return data;
  }

  categoriaPrincipal(evento: any) {
    let idE;
    if (evento.type === "ionChange") {
      this.actualTO.id_giro = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    this.negocioServico.categoriaPrincipal(idE).subscribe((respuesta) => {
      if (respuesta.code === 200) {
        this.listCategorias = respuesta.data;
        this.listCategorias.forEach((element) => {
          if (element.id_giro == this.actualTO.id_giro) {
            this.tipoGiroAux = element.nombre;
          }
        });
      }
    });
    this.subcategorias({ value: 0 });
  }

  subcategorias(evento: any) {
    let idE;
    if (evento.type === "ionChange") {
      this.actualTO.id_categoria = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    this.negocioServico.obtenerCategorias(idE).subscribe((respuesta) => {
      this.listaSubCategorias = Array();
      if (respuesta.code === 200) {
        this.listaSubCategorias = respuesta.data;
        this.listaSubCategorias.forEach((element) => {
          if (element.id_categoria == this.actualTO.id_categoria) {
            this.tipoSubAux = element.nombre;
          }
        });
      }
    });
  }

  public obtenerTipoNegocio() {
    this.negocioServico.obtnerTipoNegocio().subscribe(
      (response) => {
        if (response.code === 200) {
          this.listTipoNegocio = response.data;
          this.listTipoNegocio.forEach((element) => {
            if (element.id_tipo_negocio == this.actualTO.id_tipo_negocio) {
              this.tipoNegoAux = element.nombre;
            }
          });
        }
      },
      (error) => {
        this.listTipoNegocio = [];
      }
    );
    this.categoriaPrincipal({ value: 0 });
  }
  public obtenerCatOrganizaciones() {
    this.mostrarAfiliacion = false;
    this._general_service
      .obtenerOrganizacionesPorUsuario(this._utils_cls.getIdPersona())
      .subscribe(
        (response) => {
          if (response.code === 200) {
            this.lstOrganizaciones = Object.values(response.data);
            if (this.lstOrganizaciones.length > 0) {
              this.mostrarAfiliacion = true;
              this.lstOrganizaciones.forEach((element) => {
                this.actualTO.organizaciones.forEach((elements) => {
                  if (element.id_organizacion == elements) {
                    this.tipoOrg = element.nombre;
                  }
                });
              });
            }
          } else {
            this.mostrarAfiliacion = false;
            this.lstOrganizaciones = [];
          }
        },
        (error) => {
          this.mostrarAfiliacion = false;
          this.lstOrganizaciones = [];
        }
      );
  }

  async getAddress(){
    let estado = this.list_cat_estado.filter(estado => estado.id_estado == this.actualTO.det_domicilio.id_estado)[0].nombre;
    let municipio = this.list_cat_municipio.filter(municipio => municipio.id_municipio == this.actualTO.det_domicilio.id_municipio)[0].nombre;
    let localidad = this.list_cat_localidad.filter(localidad => localidad.id_localidad == this.actualTO.det_domicilio.id_localidad)[0].nombre;
    let address = localidad+" "+municipio+" "+estado;
    this.getCoordinates(address);
  }

  async getCoordinates(address){
    this.getCoordinatesMap.getPosts(address)
    .then(async data => {
      const arrayPosts:any = data;
      let latitud = arrayPosts.results[0].geometry.location.lat;
      let longitud = arrayPosts.results[0].geometry.location.lng;
      let gpsOptions = { maximumAge: 30000000, timeout: 5000, enableHighAccuracy: true };
      const coordinates = await Geolocation.getCurrentPosition(gpsOptions).then(res => {
        this.actualTO.det_domicilio.latitud = res.coords.latitude;
        this.actualTO.det_domicilio.longitud = res.coords.longitude;
        this.map.panTo([latitud, longitud]);
        this.marker.setLatLng([latitud, longitud]);
      })

    })
  }
}
