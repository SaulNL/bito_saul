import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ExperienciasTuristicasService} from "../../../api/experienciasTuristicas/experiencias-turisticas.service";
import {GeneralServicesService} from "../../../api/general-services.service";
import {EventosService} from "../../../api/eventos.service";
import {ToadNotificacionService} from "../../../api/toad-notificacion.service";
import {UtilsCls} from "../../../utils/UtilsCls";
import {CatEstadoModel} from "../../../Modelos/CatEstadoModel";
import {CatMunicipioModel} from "../../../Modelos/CatMunicipioModel";
import {CatLocalidadModel} from "../../../Modelos/CatLocalidadModel";
import {AlertController, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-reservacion-experiencia',
  templateUrl: './reservacion-experiencia.page.html',
  styleUrls: ['./reservacion-experiencia.page.scss'],
})
export class ReservacionExperienciaPage implements OnInit {
  @ViewChild('contendorCarrusel', { static: false }) contendorCarrusel: ElementRef;
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public idExperiencia: string;
  public infoExperiencia: any;
  public recurrencia: any;
  public tiposPago: any;
  public fotografiasArray: any;
  public videosArray: any;
  arrayUnion: any;
  indice: number = 0;
  public nombreEstado: string;
  public nombreMunicipio: string;
  public nombreLocalidad: string;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  public numeroDia: number;
  diaEscrito: string;
  public numeroMes: number;
  public anio: number;
  public hora12h: string;
  fechaSeleccionadaDiario: string;
  public isAlert: boolean = false;
  diasEnviar: number[] = [];
  diasExperiencias: string;
  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private experienciasService: ExperienciasTuristicasService,
      private general_service: GeneralServicesService,
      private eventosService: EventosService,
      private notificaciones: ToadNotificacionService,
      private utils: UtilsCls,
      public modalController: ModalController,
  ) {
    this.infoExperiencia = [];
    this.recurrencia = [];
    this.tiposPago = [];
    this.fotografiasArray = [];
    this.videosArray = [];
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
    this.loaderReservaciones = false;
    this.fechaSeleccionadaDiario = null;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idExperiencia = params.get('id');
      this.obtenerListaExperiencia(this.idExperiencia);
      this.obtenerRecurrencia();
    });
  }

  regresar(){
    this.router.navigate(['/tabs/experiencias-turisticas']);
  }

  obtenerListaExperiencia(id): void {
    this.experienciasService.experienciaDetalle(id).subscribe(
        res => {
          this.infoExperiencia = res.data[0];
          if ( this.infoExperiencia.dias !== null){
            const dias = JSON.parse(this.infoExperiencia.dias);
            const diasArray = dias.dias ? dias.dias : dias;
            const diasComa: string = diasArray.join(', ');
            this.diasExperiencias = diasComa;
            this.diasSemana(diasArray);
          }
          this.tipoPago();
          this.fotografiasArray = this.infoExperiencia.fotografias;
          this.videosArray = this.infoExperiencia.videos;
          this.arrayUnion = [...this.fotografiasArray, ...this.videosArray];
          this.arrayUnion = this.arrayUnion.map(foto => {
            // Iteramos sobre cada propiedad del objeto
            for (const prop in foto) {
              // Verificamos si el valor es igual a la cadena "null" y lo convertimos a null
              if (foto[prop] === 'null') {
                foto[prop] = null;
              }
            }
            return foto;
          });
          this.load_cat_estados();
          this.obtenerNombreMunicipios();
          this.obtenerNombreLocalidades();
          this.convertirFechaHora(this.infoExperiencia);
          console.log('array', this.arrayUnion);
          console.log('dtos', this.infoExperiencia);
        });
  }

  public load_cat_estados() {
    this.general_service.getEstadosWS().subscribe(
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
          this.loaderReservaciones = true;
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

  obtenerRecurrencia(): void{
    this.experienciasService.tipoRecurrencia().subscribe(res => {
      this.recurrencia = res.data;
    });
  }

  obtenerPosicion() {
    const container = this.contendorCarrusel.nativeElement;
    const containerWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;

    // Calcula el índice del elemento visible
    const indiceVisible = Math.round(scrollLeft / containerWidth);
    this.indice = indiceVisible;
  }

  indicadorPosicion(index: number) {
    const container = this.contendorCarrusel.nativeElement;
    const containerWidth = container.offsetWidth;
    const nuevaPosicion = index * containerWidth;
    container.scrollTo({
      left: nuevaPosicion,
      behavior: 'smooth'
    });
    this.indice = index;
  }

  tipoPago(): void{
    if (this.infoExperiencia.tipo_pago_efectivo === 1) {
      this.tiposPago.push('Efectivo');
    }
    if (this.infoExperiencia.tipo_pago_tarjeta_credito === 1) {
      this.tiposPago.push('Tarjeta de credito');
    }
    if (this.infoExperiencia.tipo_pago_tarjeta_debito === 1) {
      this.tiposPago.push('Tarjeta de debito');
    }
    if (this.infoExperiencia.tipo_pago_transferencia === 1) {
      this.tiposPago.push('Tranferencia');
    }
    this.tiposPago = this.tiposPago.join(', ');
  }

  abrirCalendario(){
    this.isAlert = true;
  }
  cerrarCalendario(isAlert: boolean){
    this.isAlert = isAlert;
    this.modalController.dismiss();
  }
  recibirFecha(fecha: string){
    this.fechaSeleccionadaDiario = fecha;
  }

  diasSemana(dias) {
    const diaToValor = {
      'Domingo': 0,
      'Lunes': 1,
      'Martes': 2,
      'Miercoles': 3,
      'Jueves': 4,
      'Viernes': 5,
      'Sabado': 6
    };

    for (const dia of dias) {
      if (diaToValor.hasOwnProperty(dia)) {
        this.diasEnviar.push(diaToValor[dia]);
      }
    }
  }
  convertirFechaHora(infoExperiencia: any){
    const fecha = infoExperiencia.fecha_inicio_experiencia;
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
    if ( fecha !== null){
      const fechaObjeto = new Date(fecha);
      this.numeroDia = fechaObjeto.getDate();
      this.numeroMes = fechaObjeto.getMonth();
      this.anio = fechaObjeto.getFullYear();
      const diaNumero = fechaObjeto.getDay();
      this.diaEscrito = dias[diaNumero];
      //this.hora12h = fechaObjeto.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
      this.hora12h = fechaObjeto.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
    } else if ( fecha === null){
      this.hora12h = this.infoExperiencia.hora_inicio_experiencia;
    }
  }

}
