import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CatEstadoModel} from "../../../Modelos/CatEstadoModel";
import {CatMunicipioModel} from "../../../Modelos/CatMunicipioModel";
import {CatLocalidadModel} from "../../../Modelos/CatLocalidadModel";
import {EventosService} from "../../../api/eventos.service";
import {GeneralServicesService} from "../../../api/general-services.service";
import {UtilsCls} from "../../../utils/UtilsCls";
import {ToadNotificacionService} from "../../../api/toad-notificacion.service";
import QRCode from "easyqrcodejs";
import html2canvas from "html2canvas";
import {Directory, Filesystem} from "@capacitor/filesystem";
import { ModalController } from '@ionic/angular';
import { Media, MediaSaveOptions } from "@capacitor-community/media";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-info-reservacion',
  templateUrl: './info-reservacion.component.html',
  styleUrls: ['./info-reservacion.component.scss'],
})
export class InfoReservacionComponent implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @ViewChild('codeQr', { static: false }) codeQr: ElementRef;
  @ViewChild('contendorCarrusel', { static: false }) contendorCarrusel: ElementRef;
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  public idEventoReservacion: number | null;
  public infoReservacion: any;
  public numeroDia: number;
  public diaEscrito: string;
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
  eventoDetalle: any;
  loader = false;
  cupon = true;

  constructor(
      private eventosService: EventosService,
      private _general_service: GeneralServicesService,
      private utils: UtilsCls,
      private notificaciones: ToadNotificacionService,
      private cdRef: ChangeDetectorRef,
      private modalController: ModalController,
      public platform: Platform
  ) {
    this.loaderReservaciones = false;
    this.infoEvento = [];
    this.fotografiasArray = [];
    this.videosArray = [];
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
    const datosUsuario = JSON.parse(localStorage.getItem('u_data'));
    this.usuario = `${datosUsuario.nombre} ${datosUsuario.paterno} ${datosUsuario.materno}`;
    this.infoReservacion = this.eventosService.getSelectedObj();
  }

  ngOnInit() {
    this.fotografiasArray = this.infoReservacion.fotografias;
    this.videosArray = this.infoReservacion.videos;
    this.arrayUnion = [...this.fotografiasArray, ...this.videosArray];
    this.base64Video = null;
    this.obtenerListaEvento();
    //this.obtenerUbicacionActual();
    this.generarQr();
  }

  ngOnChanges(): void {
    this.cdRef.detectChanges();
  }

  generarQr(){
    setTimeout(() => {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.infoEvento.latitud},${this.infoEvento.longitud}`;
      const options = {
        text: url,
        width: 200,
        height: 200,
      };
      this.qr = new QRCode(this.qrcode.nativeElement, options);
    }, 500);
  }

  obtenerListaEvento(): void {
    this.eventosService.eventoDetalle(this.infoReservacion.id_evento).subscribe(
        res => {
          this.infoEvento = res.data[0];
          this.convertirFechaHora(this.infoEvento);
          this.load_cat_estados();
          this.obtenerNombreMunicipios();
          this.obtenerNombreLocalidades();
        });
  }


  convertirFechaHora(infoEvento: any){
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
    const fecha1 = infoEvento.fecha;
    const fecha = this.infoReservacion.fc_evento_reservacion;
    const nuevaFecha = new Date(infoEvento.fecha);
    const fechaObjeto = new Date(fecha);
    this.numeroDia = fechaObjeto.getDate();
    this.numeroMes = fechaObjeto.getMonth();
    this.anio = fechaObjeto.getFullYear();
    const diaNum = fechaObjeto.getDay();
    this.diaEscrito = dias[diaNum];
    if ( fecha1 !== null){
      const hora = nuevaFecha.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
      this.hora12h = hora;
    } else {
      this.hora12h = infoEvento.hora;
    }
  }

  /* Metodo para obtener la ubicacion actual
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
   */


  public load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
        response => {
          if (this.utils.is_success_response(response.code)) {
            this.list_cat_estado = response.data.list_cat_estado;
            this.list_cat_estado.forEach(element => {
              if (element.id_estado == this.infoEvento.id_estado) {
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
    this.eventosService.eventosMunicipios(this.infoEvento.id_estado).subscribe(
        res => {
          if (this.utils.is_success_response(res.code)) {
            this.list_cat_municipio = res.data.list_cat_municipio;
            this.list_cat_municipio.forEach(element => {
              if (element.id_municipio == this.infoEvento.id_municipio) {
                this.nombreMunicipio = element.nombre + ', ';
              }
            });
          }
        }, error => {
          this.notificaciones.error(error);
        });
  }

  obtenerNombreLocalidades() {
    this.eventosService.eventosLocalidadAll(this.infoEvento.id_municipio).subscribe(
        res => {
          if (this.utils.is_success_response(res.code)) {
            this.list_cat_localidad = res.data.list_cat_localidad;
            this.list_cat_localidad.forEach(element => {
              if (element.id_localidad == this.infoEvento.id_localidad) {
                this.nombreLocalidad = element.nombre + ', ';
              }
            });
          }
        }, error => {
          this.notificaciones.error(error);
        });
  }

  reservacion(){
    this.loader = true;
    this.cupon = false;
    this.qrGenerar();
    //this.router.navigate(['/tabs/eventos/generar-reservacion'], { state: { cadena: this.infoReservacion } });
    setTimeout(() => {
      this.crearImagen(this.infoEvento);
    }, 700);
  }

  qrGenerar(){
    setTimeout(() => {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.infoEvento.latitud},${this.infoEvento.longitud}`;
      const options = {
        text: url,
        width: 200,
        height: 200,
      };
      this.qr = new QRCode(this.codeQr.nativeElement, options);
    }, 300);
  }

  async crearImagen(evento) {
    this.loader = false;
    this.cupon = true;
    html2canvas(document.querySelector("#contenidoCupon")).then(async canvas => {
      const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10, 1000) + evento.evento + '.png';

      if ( this.platform.is("ios") ){
        let opts: MediaSaveOptions = { path: canvas.toDataURL().toString(), fileName: fileName };
        await Media.savePhoto(opts);
      } else {
        Filesystem.writeFile({
          path: fileName,
          data: canvas.toDataURL().toString(),
          directory: Directory.Documents
        }).then(() => {
        }, error => {
          this.notificaciones.error(error);
        });
      }

      this.notificaciones.exito('Se descargo correctamente cupón de ' + evento.evento);
    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }
}
