import { Component, OnInit } from '@angular/core';
import { FiltrosModel } from '../../Modelos/FiltrosModel';
import { FiltrosService } from '../../api/filtros.service';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { ProveedorServicioService } from '../../api/proveedor-servicio.service';
import { SolicitudesService } from '../../api/solicitudes.service';
import { SolicitudesModel } from '../../Modelos/SolicitudesModel';
import { AppSettings } from '../../AppSettings';
import { UtilsCls } from '../../utils/UtilsCls';
import { ModalInfoSolicitudComponent } from '../../componentes/modal-info-solicitud/modal-info-solicitud.component';
import { ModalController } from '@ionic/angular';
import { Router } from "@angular/router";
import { UbicacionModel } from '../../Modelos/UbicacionModel';
import { UbicacionActualModel   } from '../../Modelos/UbicacionActualModel';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.page.html',
  styleUrls: ['./solicitud.page.scss'],
  providers: [
    UtilsCls
  ]
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

  constructor(
    private filtrosService: FiltrosService,
    private serviceProveedores: ProveedorServicioService,
    private _notificacionService: ToadNotificacionService,
    private servicioSolicitudes: SolicitudesService,
    private _utils_cls: UtilsCls,
    public modalController: ModalController,
    private _router: Router
  ) { }

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
    this.mensaje = 'Todas las solicitudes';
    this.banner = '';
    this.lstSolicitudes = new Array<SolicitudesModel>();
    this.strUbicacionActual = new Array<UbicacionActualModel>();
    this.loader = true;
    this.numeroVistas = 0;
    this.productoDefault = AppSettings.IMG_ERROR_PRODUCTO;
    this.obtenerSolicitudes();
    this.mostrarSolicitud = this._utils_cls.existe_sesion();
  }

  buscarToolbar(respuesta) {
    this.idGiro = null;
    this.anyFiltros = new FiltrosModel();
    this.mostrarDetalle = false;
    this.reiniciarFiltro();
    this.obtenerCatagorias(null);
    this.mensaje = 'Todas las solicitudes';
    this.anyFiltros.strBuscar = JSON.parse(JSON.stringify(respuesta));
    this.banner = respuesta;
    this.obtenerSolicitudes();
  }

  reiniciarFiltro() {
    this.anyFiltros.tipoBusqueda = 0;
    this.anyFiltros.idEstado = 29;
    this.anyFiltros.kilometros = 1;
    this.lstCatTipoNegocio.map(item => {
      item.estaSeleccionado = false;
    });
    this.anyFiltros.blnEntrega = null;
    this.filtrosService.actualizarfiltro();
  }

  public obtenerCatagorias(buscar) {
    this.listaCategorias=[];
    this.serviceProveedores.obtenerCategoriasGiro(buscar).subscribe(
      response => {
        this.listaCategorias = response.data;
        this.listaCategorias.map(i => {
          i.estaSeleccionado = false;
          i.id_tipo_producto = i.id_categoria;
        });
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

  public obtenerSolicitudes() {
    if (navigator.geolocation && this.anyFiltros.tipoBusqueda === 1) {
      navigator.geolocation.getCurrentPosition(posicion => {
          this.anyFiltros.latitud = posicion.coords.latitude;
          this.anyFiltros.longitud = posicion.coords.longitude;
          this.obtenerSolicitudesServicio();
        },
        error => {
          this._notificacionService.error('error bisqueda');
          this.lstSolicitudes = [];
          window.scrollTo({top: 0, behavior: 'smooth'});
          this.loader = false;
        }, {enableHighAccuracy : true, maximumAge : 60000, timeout : 10000 });
    } else {
      this.anyFiltros.tipoBusqueda = 0;
      this.obtenerSolicitudesServicio();
    }
  }

  public obtenerSolicitudesServicio() {
    this.loader = true;
    this.mostrarDetalle = false;
    this.servicioSolicitudes.obtenerSolicitudesPublicadas(this.anyFiltros).subscribe(
      response => {
        if (response.data !== null) {
          this.lstSolicitudes = response.data;
        } else {
          this.lstSolicitudes = [];
        }
      },
      error => {
        this._notificacionService.error(error);
        console.error(error);
        this.lstSolicitudes = [];
      },
      () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.loader = false;
      }
    );
  }

  masInformacion( solicitud: any) {
    this.mostrarSolicitud = this._utils_cls.existe_sesion();
    if(this.mostrarSolicitud){
      this.accionSolicitud(solicitud);
      this.modalDetalleSolicitud(solicitud);
    }else {
      this._router.navigate(['/tabs/login']);
    }
  }

  async modalDetalleSolicitud(solicitud: any) {
    const modal = await this.modalController.create({
      component:  ModalInfoSolicitudComponent ,
      cssClass: 'my-custom-class',
      componentProps: {
        solicitud: solicitud
      }
    });
    return await modal.present();
  }

  accionSolicitud(solicitud) {
    this.solicitud = solicitud;
    this.visteMiSolicitud(solicitud);
    this.quienNumeroVioPublicacion(solicitud.id_solicitud);
  }

  visteMiSolicitud(solicitud: SolicitudesModel) {
    this.ubicacion.latitud = this.miUbicacionlatitud;
    this.ubicacion.longitud = this.miUbicacionlongitud;
    this.servicioSolicitudes.guardarQuienVioSolicitud(solicitud, this.ubicacion).subscribe(
      response => {
        if (response.code === 200) {
        }
      },
      error => {
      }
    );
  }

  public obtenerGeolocalizacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(posicion => {
          this.miUbicacionlatitud = posicion.coords.latitude;
          this.miUbicacionlongitud = posicion.coords.longitude;
          this.obtenerMiUbicacion();
        },
        error => {
          console.log(error);
        }, {enableHighAccuracy : true, maximumAge : 60000, timeout : 10000 });
    }
  }

  public obtenerMiUbicacion() {
    this.serviceProveedores.obtenerMiUbicacion(this.miUbicacionlatitud, this.miUbicacionlongitud).subscribe(
      response => {
        this.strUbicacionActual = response.data.miUbicacion;
      },
      error => {
        this._notificacionService.error(error);
      }
    );
  }

  quienNumeroVioPublicacion(id_solicitud) {
    this.servicioSolicitudes.obtenerNumeroQuienVioPublicacion(id_solicitud).subscribe(
      response => {
        this.numeroVistas = response.data;
      },
      error => {
      }
    );
  }

}
