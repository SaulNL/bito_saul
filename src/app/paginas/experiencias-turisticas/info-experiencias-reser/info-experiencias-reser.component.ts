import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ExperienciasTuristicasService} from "../../../api/experienciasTuristicas/experiencias-turisticas.service";
import {CatEstadoModel} from "../../../Modelos/CatEstadoModel";
import {CatMunicipioModel} from "../../../Modelos/CatMunicipioModel";
import {CatLocalidadModel} from "../../../Modelos/CatLocalidadModel";
import {EventosService} from "../../../api/eventos.service";
import {GeneralServicesService} from "../../../api/general-services.service";
import {ToadNotificacionService} from "../../../api/toad-notificacion.service";
import {UtilsCls} from "../../../utils/UtilsCls";
import QRCode from "easyqrcodejs";
import html2canvas from "html2canvas";
import { Platform } from '@ionic/angular';
import { Media, MediaSaveOptions } from "@capacitor-community/media";
import {Directory, Filesystem} from "@capacitor/filesystem";

@Component({
  selector: 'app-info-experiencias-reser',
  templateUrl: './info-experiencias-reser.component.html',
  styleUrls: ['./info-experiencias-reser.component.scss'],
})
export class InfoExperienciasReserComponent implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @ViewChild('contendorCarrusel', { static: false }) contendorCarrusel: ElementRef;
  @ViewChild('codeQr', { static: false }) codeQr: ElementRef;
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  infoReservacion: any;
  infoExperiencia: any;
  fotografiasArray: any;
  videosArray: any;
  arrayUnion: any;
  usuario: any;
  public numeroDia: number;
  public diaEscrito: string;
  public numeroMes: number;
  public anio: number;
  public hora12h: string;
  public nombreEstado: any;
  public nombreMunicipio: string;
  public nombreLocalidad: string;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public qr: any;
  loader = false;
  cupon = true;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';

  constructor(
      private experienciasService: ExperienciasTuristicasService,
      private eventosService: EventosService,
      private _general_service: GeneralServicesService,
      private notificaciones: ToadNotificacionService,
      private utils: UtilsCls,
      public platform: Platform
  ) {
    this.infoExperiencia = [];
    const datosUsuario = JSON.parse(localStorage.getItem('u_data'));
    this.usuario = `${datosUsuario.nombre} ${datosUsuario.paterno} ${datosUsuario.materno}`;
    this.infoReservacion = experienciasService.getSelectedObj();
  }

  ngOnInit() {
    this.fotografiasArray = this.infoReservacion.fotografias;
    this.videosArray = this.infoReservacion.videos;
    this.arrayUnion = [...this.fotografiasArray, ...this.videosArray];
    this.obtenerDetalleExperiencias();
    this.generarQr();
  }

  generarQr(){
    setTimeout(() => {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.infoExperiencia.latitud},${this.infoExperiencia.longitud}`;
      const options = {
        text: url,
        width: 200,
        height: 200,
      };
      this.qr = new QRCode(this.qrcode.nativeElement, options);
    }, 500);
  }

  obtenerDetalleExperiencias(){
    this.experienciasService.experienciaDetalle(this.infoReservacion.id_experiencia_turistica).subscribe(
        res => {
          this.infoExperiencia = res.data[0];
          this.convertirFechaHora(this.infoExperiencia);
          this.load_cat_estados();
          this.obtenerNombreMunicipios();
          this.obtenerNombreLocalidades();
        });
  }

  convertirFechaHora(infoEvento: any){
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
    const fecha1 = infoEvento.fecha_inicio_experiencia;
    const fecha = this.infoReservacion.fc_experiencia_reservacion;
    const nuevaFecha = new Date(infoEvento.fecha);
    const fechaObjeto = new Date(fecha);
    this.numeroDia = fechaObjeto.getDate();
    this.numeroMes = fechaObjeto.getMonth();
    this.anio = fechaObjeto.getFullYear();
    const diaNum = fechaObjeto.getDay();
    this.diaEscrito = dias[diaNum];
    if ( fecha1 !== null){
      const hora = nuevaFecha.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
      this.hora12h = infoEvento.hora_inicio_experiencia;
    } else {
      this.hora12h = infoEvento.hora_inicio_experiencia;
    }
  }

  public load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
        response => {
          if (this.utils.is_success_response(response.code)) {
            this.list_cat_estado = response.data.list_cat_estado;
            this.list_cat_estado.forEach(element => {
              if (element.id_estado === this.infoExperiencia.id_estado) {
                this.nombreEstado = element.nombre;
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
    this.eventosService.eventosMunicipios(this.infoExperiencia.id_estado).subscribe(
        res => {
          if (this.utils.is_success_response(res.code)) {
            this.list_cat_municipio = res.data.list_cat_municipio;
            this.list_cat_municipio.forEach(element => {
              if (element.id_municipio === this.infoExperiencia.id_municipio) {
                this.nombreMunicipio = element.nombre + ', ';
              }
            });
          }
        }, error => {
          this.notificaciones.error(error);
        });
  }

  obtenerNombreLocalidades() {
    this.eventosService.eventosLocalidadAll(this.infoExperiencia.id_municipio).subscribe(
        res => {
          if (this.utils.is_success_response(res.code)) {
            this.list_cat_localidad = res.data.list_cat_localidad;
            this.list_cat_localidad.forEach(element => {
              if (element.id_localidad === this.infoExperiencia.id_localidad) {
                this.nombreLocalidad = element.nombre + ', ';
              }
            });
          }
        }, error => {
          this.notificaciones.error(error);
        });
  }


  qrGenerar(){
    setTimeout(() => {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.infoExperiencia.latitud},${this.infoExperiencia.longitud}`;
      const options = {
        text: url,
        width: 200,
        height: 200,
      };
      this.qr = new QRCode(this.codeQr.nativeElement, options);
    }, 300);
  }

  reservacion(){
    this.loader = true;
    this.cupon = false;
    this.qrGenerar();
    //this.router.navigate(['/tabs/eventos/generar-reservacion'], { state: { cadena: this.infoReservacion } });
    setTimeout(() => {
      this.crearImagen(this.infoReservacion);
    }, 700);
  }

  async crearImagen(evento) {
    this.loader = false;
    this.cupon = true;
    html2canvas(document.querySelector("#contenidoCupon")).then(async canvas => {
      const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10, 1000) + evento.titulo_experiencia + '.png';

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

      this.notificaciones.exito('Se descargo correctamente cupón de ' + evento.titulo_experiencia);
    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }

}
