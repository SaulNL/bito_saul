import { AfiliacionPlazaModel } from "./../../Modelos/AfiliacionPlazaModel";
import { Component, OnInit, Output, ViewChild } from "@angular/core";
import { FiltrosModel } from "../../Modelos/FiltrosModel";
import { FiltrosService } from "../../api/filtros.service";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { ProveedorServicioService } from "../../api/proveedor-servicio.service";
import { SolicitudesService } from "../../api/solicitudes.service";
import { SolicitudesModel } from "../../Modelos/SolicitudesModel";
import { AppSettings } from "../../AppSettings";
import { UtilsCls } from "../../utils/UtilsCls";
import { ModalInfoSolicitudComponent } from "../../componentes/modal-info-solicitud/modal-info-solicitud.component";
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { UbicacionModel } from "../../Modelos/UbicacionModel";
import { UbicacionActualModel } from "../../Modelos/UbicacionActualModel";
import { ModalLoguearseComponent } from 'src/app/componentes/modal-loguearse/modal-loguearse.component';
import { OptionBackLogin } from "src/app/Modelos/OptionBackLoginModel";

@Component({
  selector: "app-solicitud",
  templateUrl: "./solicitud.page.html",
  styleUrls: ["./solicitud.page.scss"],
  providers: [UtilsCls],
})
export class SolicitudPage implements OnInit {
  public idGiro: any;
  public anyFiltros: FiltrosModel;
  public kilometrosView: number;
  public mostrarDetalle: boolean;
  public lstCatTipoNegocio: Array<any>;
  public listaCategorias: any;
  public mensaje: string;
  public banner: string;
  public loader: boolean;
  public lstSolicitudes: Array<SolicitudesModel>;
  public productoDefault: string;
  public user: any;
  public mostrarSolicitud: boolean;
  public solicitud: SolicitudesModel;
  public ubicacion = new UbicacionModel();
  public miUbicacionlongitud: number;
  public miUbicacionlatitud: number;
  public strUbicacionActual: Array<UbicacionActualModel>;
  public numeroVistas: number;
  public cargando = "Cargando";
  public plazaAfiliacion: AfiliacionPlazaModel;
  public isIos: boolean;
  public fuenteExclusiva:String;
  private modal: any;
  public existeSesion: boolean;
  public typeLogin: OptionBackLogin;
  obj: any;
  loaderSolicitud: boolean=true;
  idSolicitud: any;
  constructor(
    private filtrosService: FiltrosService,
    private serviceProveedores: ProveedorServicioService,
    private _notificacionService: ToadNotificacionService,
    private servicioSolicitudes: SolicitudesService,
    private _utils_cls: UtilsCls,
    public modalController: ModalController,
    private _router: Router,
    private platform: Platform,
    public alertController: AlertController
  ) {
    this.isIos = this.platform.is("ios");
    this.existeSesion = _utils_cls.existe_sesion();
    this.typeLogin = new OptionBackLogin();
    
    this.platform.backButton.subscribeWithPriority(85288880, () => {
    this.dismiss();
    
  });
  }

  ngOnInit() {
    this.idGiro = null;
    this.kilometrosView = 10;
    this.anyFiltros = new FiltrosModel();
    this.anyFiltros.idCategoriaNegocio = null;
    this.anyFiltros.kilometros = this.kilometrosView;
    this.anyFiltros.kilometros = 1;
    this.anyFiltros.idEstado = 29;
    this.mostrarDetalle = false;
    this.lstCatTipoNegocio = new Array<any>();
    this.listaCategorias = [];
    this.miUbicacionlongitud = 0;
    this.miUbicacionlatitud = 0;
    this.mensaje = "Todas las solicitudes";
    this.banner = "";
    this.lstSolicitudes = new Array<SolicitudesModel>();
    this.strUbicacionActual = new Array<UbicacionActualModel>();
    this.loader = true;
    this.numeroVistas = 0;
    this.productoDefault = AppSettings.IMG_ERROR_PRODUCTO;
    this.obtenerSolicitudes();
    this.mostrarSolicitud = this._utils_cls.existe_sesion();
    this.mostrarLoguearse();
    if (localStorage.getItem("isRedirected") === "false" ) {
      localStorage.setItem("isRedirected", "true");
        location.reload();
    }
  }

  buscarToolbar(respuesta) {
    this.idGiro = null;
    this.anyFiltros = new FiltrosModel();
    this.mostrarDetalle = false;
    this.reiniciarFiltro();
    this.obtenerCatagorias(null);
    this.mensaje = "Todos los requerimientos de compra";
    this.anyFiltros.strBuscar = JSON.parse(JSON.stringify(respuesta));
    this.banner = respuesta;
    this.obtenerSolicitudes();
  }

  reiniciarFiltro() {
    this.anyFiltros.tipoBusqueda = 0;
    this.anyFiltros.idEstado = 29;
    this.anyFiltros.kilometros = 1;
    this.lstCatTipoNegocio.map((item) => {
      item.estaSeleccionado = false;
    });
    this.anyFiltros.blnEntrega = null;
    this.filtrosService.actualizarfiltro();
  }

  public obtenerCatagorias(buscar) {
    this.listaCategorias = [];
    this.serviceProveedores.obtenerCategoriasGiro(buscar).subscribe(
      (response) => {
        this.listaCategorias = response.data;
        this.listaCategorias.map((i) => {
          i.estaSeleccionado = false;
          i.id_tipo_producto = i.id_categoria;
        });
      },
      (error) => {
        this._notificacionService.error(error);
      }
    );
  }

  public obtenerSolicitudes() {
    if (navigator.geolocation && this.anyFiltros.tipoBusqueda === 1) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          this.anyFiltros.latitud = posicion.coords.latitude;
          this.anyFiltros.longitud = posicion.coords.longitude;
          this.obtenerSolicitudesServicio();
        },
        (error) => {
          this._notificacionService.error("error bisqueda");
          this.lstSolicitudes = [];
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.loader = false;
        },
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
      );
    } else {
      this.anyFiltros.tipoBusqueda = 0;
      this.obtenerSolicitudesServicio();
    }
  }

  public obtenerSolicitudesServicio() {
    this.loader = true;
    this.mostrarDetalle = false;
    this.plazaAfiliacion = JSON.parse(localStorage.getItem("org"));
    if (this.plazaAfiliacion != null) {
      this.anyFiltros.organizacion = this.plazaAfiliacion.id_organizacion;
    }
    this.servicioSolicitudes
      .obtenerSolicitudesPublicadas(this.anyFiltros)
      .subscribe(
        (response) => {
          if (response.data !== null) {
            this.lstSolicitudes = response.data;
          } else {
            this.lstSolicitudes = [];
          }
        },
        (error) => {
          this._notificacionService.error(error);
          this.lstSolicitudes = [];
        },
        () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.loader = false;
        }
      );
  }

  masInformacion(solicitud: any) {
    this.mostrarSolicitud = this._utils_cls.existe_sesion();
    if (this.mostrarSolicitud) {
      this.loaderSolicitud = false;
      this.idSolicitud = solicitud.id_solicitud;
      setTimeout(()=>{      
      this.accionSolicitud(solicitud);
      this.modalDetalleSolicitud(solicitud);                      
      }, 1000);
    } else {
      this.typeLogin.type = "requerimiento";
      this.typeLogin.url = "";
      localStorage.setItem("isRedirected", "false");
      localStorage.setItem("Page", "Requerimiento");
      const body = JSON.stringify(this.typeLogin);
      this._router.navigate(["/tabs/login"], {
        queryParams: { perfil: body },
      });
    }
  }

  async modalDetalleSolicitud(solicitud: any) {
    const modal = await this.modalController.create({
      component: ModalInfoSolicitudComponent,
      cssClass: "my-custom-class",
      componentProps: {
        solicitud: solicitud,
      },
    });

    modal.onDidDismiss()
      .then((data) => {
        const user = data['data'];
        this.loaderSolicitud=true;
        
    });
    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true,
    });
  }
  
  accionSolicitud(solicitud) {
    this.solicitud = solicitud;
    this.visteMiSolicitud(solicitud);
    this.quienNumeroVioPublicacion(solicitud.id_solicitud);
  }

  visteMiSolicitud(solicitud: SolicitudesModel) {
    this.ubicacion.latitud = this.miUbicacionlatitud;
    this.ubicacion.longitud = this.miUbicacionlongitud;
    this.servicioSolicitudes
      .guardarQuienVioSolicitud(solicitud, this.ubicacion)
      .subscribe(
        (response) => {
          if (response.code === 200) {
          }
        },
        (error) => {}
      );
  }

  public obtenerGeolocalizacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          this.miUbicacionlatitud = posicion.coords.latitude;
          this.miUbicacionlongitud = posicion.coords.longitude;
          this.obtenerMiUbicacion();
        },
        (error) => {},
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
      );
    }
  }

  public obtenerMiUbicacion() {
    this.serviceProveedores
      .obtenerMiUbicacion(this.miUbicacionlatitud, this.miUbicacionlongitud)
      .subscribe(
        (response) => {
          this.strUbicacionActual = response.data.miUbicacion;
        },
        (error) => {
          this._notificacionService.error(error);
        }
      );
  }

  quienNumeroVioPublicacion(id_solicitud) {
    this.servicioSolicitudes
      .obtenerNumeroQuienVioPublicacion(id_solicitud)
      .subscribe(
        (response) => {
          this.numeroVistas = response.data;
        },
        (error) => {}
      );
  }

  public mostrarLoguearse(){
    if (this.existeSesion) {
    }else{
        if(this.plazaAfiliacion != null){
            
        }else{
          setTimeout(() =>{
            this. mensajeRegistro();
          },100)
        }
    }
  }

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bitoo!',
      message: "¿Ya tienes una cuenta?",
        buttons: [
            {
                text: "Iniciar sesión",
                cssClass: 'text-grey',
                handler: () => {
                  this._router.navigate(['/tabs/login']);
                }
            },
            {
                text: "Registrate",
                cssClass: 'text-rosa',
                handler: () => {
                    this._router.navigate(["/tabs/login/sign-up"]);
                },
            },
        ],
    });
    await alert.present();
  }
  ngAfterViewInit(){
    this.nombrePlazas();
  }
  public nombrePlazas(){
    const organ=localStorage.getItem('org');
    if(organ?.length>0){
       this.obj = JSON.parse(organ);
    }
    this.fuenteExclusiva=this.obj?.nombre;
  }
}
