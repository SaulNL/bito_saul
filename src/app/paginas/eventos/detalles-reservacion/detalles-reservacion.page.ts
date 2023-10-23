import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EventosService} from '../../../api/eventos.service';
import {GeneralServicesService} from '../../../api/general-services.service';
import {UtilsCls} from '../../../utils/UtilsCls';
import {CatEstadoModel} from '../../../Modelos/CatEstadoModel';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';
import {CatMunicipioModel} from '../../../Modelos/CatMunicipioModel';
import {CatLocalidadModel} from '../../../Modelos/CatLocalidadModel';
import QRCode from 'easyqrcodejs';

@Component({
  selector: 'app-detalles-reservacion',
  templateUrl: './detalles-reservacion.page.html',
  styleUrls: ['./detalles-reservacion.page.scss'],
})
export class DetallesReservacionPage implements OnInit {

  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @ViewChild('contendorCarrusel', { static: false }) contendorCarrusel: ElementRef;
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  public idEventoReservacion: number | null;
  public infoReservacion: any;
  public detallesReservacion: any;
  public numeroDia: number;
  public numeroMes: number;
  public anio: number;
  public infoEvento: any;
  public nombreEstado: any;
  public nombreMunicipio: string;
  public nombreLocalidad: string;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public base64Video = null;
  public fotografiasArray: any;
  public videosArray: any;
  usuario: any;
  public hora12h: string;
  public qr: any;
  arrayUnion: any;
  public latitud: any;
  public longitud: any;
  public blnPermisoUbicacion: any;

  constructor(
      private router: Router,
      private eventosService: EventosService,
      private _general_service: GeneralServicesService,
      private utils: UtilsCls,
      private notificaciones: ToadNotificacionService
  ) {
    this.loaderReservaciones = false;
    this.infoEvento = [];
    this.detallesReservacion = [];
    this.fotografiasArray = [];
    this.videosArray = [];
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
    const datosUsuario = JSON.parse(localStorage.getItem('u_data'));
    this.usuario = `${datosUsuario.nombre} ${datosUsuario.paterno} ${datosUsuario.materno}`;
  }

  ngOnInit() {
    this.infoReservacion = this.eventosService.getSelectedObj();
    this.detallesReservacion = this.eventosService.getReservacionObj();
    this.fotografiasArray = this.infoReservacion.fotografias;
    this.videosArray = this.infoReservacion.videos;
    this.arrayUnion = [...this.fotografiasArray, ...this.videosArray];
    this.base64Video = null;
    this.convertirFechaHora();
    this.obtenerListaEvento();
    this.obtenerUbicacionActual();
  }

  ionViewWillEnter(){
    setTimeout(() => {
      const url = `https://www.google.com/maps/dir/${this.latitud},${this.longitud}/${this.infoEvento[0]?.latitud},${this.infoEvento[0]?.longitud}`;
      const options = {
        text: url,
        width: 200,
        height: 200,
      };
      this.qr = new QRCode(this.qrcode.nativeElement, options);
    }, 1000);
  }

  regresar(){
    this.router.navigate(['/tabs/eventos/mis-reservaciones'], {
      queryParams: {
        special: true
      }
    });
  }

  convertirFechaHora(){
    const fecha = this.infoReservacion.fc_evento_reservacion;
    const fechaObjeto = new Date(fecha);
    this.numeroDia = fechaObjeto.getDate();
    this.numeroMes = fechaObjeto.getMonth();
    this.anio = fechaObjeto.getFullYear();
    this.hora12h = fechaObjeto.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
  }

  obtenerListaEvento(): void {
    this.eventosService.eventoDetalle(this.infoReservacion.id_evento).subscribe(
        res => {
          this.infoEvento = res.data;
          this.load_cat_estados();
          this.obtenerNombreMunicipios();
          this.obtenerNombreLocalidades();
        });
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitud = position.coords.latitude;
            this.longitud = position.coords.longitude;
          },
          (error) => {
            console.error('Error al obtener la ubicación:', error);
          }
      );
    } else {
      this.notificaciones.error('No se puede obtener la ubicación');
    }
  }


  public load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
        response => {
          if (this.utils.is_success_response(response.code)) {
            this.list_cat_estado = response.data.list_cat_estado;
            this.list_cat_estado.forEach(element => {
              if (element.id_estado == this.infoEvento[0]?.id_estado) {
                this.nombreEstado = element.nombre;
                this.loaderReservaciones = true;
              }
            });
          }
        },
        error => {
          this.notificaciones.error(error);
        }
    );
  }

  obtenerNombreMunicipios() {
    this.eventosService.eventosMunicipios(this.infoEvento[0]?.id_estado).subscribe(
        res => {
          if (this.utils.is_success_response(res.code)) {
            this.list_cat_municipio = res.data.list_cat_municipio;
            this.list_cat_municipio.forEach(element => {
              if (element.id_municipio == this.infoEvento[0]?.id_municipio) {
                this.nombreMunicipio = element.nombre + ', ';
              }
            });
          }
        }, error => {
          this.notificaciones.error(error);
        });
  }

  obtenerNombreLocalidades() {
    this.eventosService.eventosLocalidadAll(this.infoEvento[0]?.id_municipio).subscribe(
        res => {
          if (this.utils.is_success_response(res.code)) {
            this.list_cat_localidad = res.data.list_cat_localidad;
            this.list_cat_localidad.forEach(element => {
              if (element.id_localidad == this.infoEvento[0]?.id_localidad) {
                this.nombreLocalidad = element.nombre + ', ';
              }
            });
          }
        }, error => {
          this.notificaciones.error(error);
        });
  }

  reservacion(){
    this.router.navigate(['/tabs/eventos/generar-reservacion'], { state: { cadena: this.infoReservacion } });
  }

}
