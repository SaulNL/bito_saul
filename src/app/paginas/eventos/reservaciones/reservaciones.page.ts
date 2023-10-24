import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventosService} from '../../../api/eventos.service';
import {GeneralServicesService} from '../../../api/general-services.service';
import { CatEstadoModel } from './../../../Modelos/CatEstadoModel';
import {CatMunicipioModel} from '../../../Modelos/CatMunicipioModel';
import {CatLocalidadModel} from '../../../Modelos/CatLocalidadModel';
import {UtilsCls} from '../../../utils/UtilsCls';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {AlertController, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit {
  @ViewChild('contendorCarrusel', { static: false }) contendorCarrusel: ElementRef;
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public idEvento: string;
  public infoEvento: any;
  public detalleReser: any;
  public cadenaReservacion: any;
  mostrarLabel: boolean;
  public infoRecurrencia: any;
  public numeroDia: number;
  public numeroMes: number;
  public anio: number;
  public hora12h: string;
  public loaderReservaciones: boolean;
  public nombreEstado: any;
  public nombreMunicipio: string;
  public nombreLocalidad: string;
  public msj = 'Cargando';
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public idPersona: number | null;
  public existeSesion: boolean;
  public noPersonas: any;
  public id_estado: any;
  public id_municipio: any;
  public id_localidad: any;
  public fotografiasArray: any;
  public videosArray: any;

  indice: number = 0;
  arrayUnion: any;
  diasEvento: string;
  public isAlert: boolean = false;
  diasEnviar: number[] = [];
  diasValidos: number[] = [];
  fechaFormat: string;
  fechaSeleccionadaDiario: string;
  fechaSeleccionada: string;
  mesSeleccionado: string;
  mesesArray: Date[] = [];
  fechaReservacion: any;
  fechaReservacionDiario: any;
  base64Video = null;
  slideOpts = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: false,
    spaceBetween: 10,
  };

  constructor(
      private eventosService: EventosService,
      private route: ActivatedRoute,
      private router: Router,
      private utils: UtilsCls,
      private _general_service: GeneralServicesService,
      private notificaciones: ToadNotificacionService,
      public alertController: AlertController,
      public modalController: ModalController,
  ) {
    this.infoEvento = [];
    this.fotografiasArray = [];
    this.videosArray = [];
    this.cadenaReservacion = [];
    this.mostrarLabel = false;
    this.infoRecurrencia = [];
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
    this.loaderReservaciones = false;
    this.idPersona = null;
    this.existeSesion = utils.existe_sesion();
    this.fechaSeleccionada = null;
    this.fechaSeleccionadaDiario = null;
    this.fechaFormat = null;
    const idEvento = localStorage.getItem('idEvento');
    if (idEvento != null){
      localStorage.removeItem('idEvento');
      location.reload();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idEvento = params.get('id');
      this.obtenerListaEvento();
    });
  }

  ionViewDidEnter(){
    this.idPersona = (this.utils.existSession()) ? this.utils.getIdUsuario() : null;
    this.base64Video = null;
  }

  obtenerListaEvento(): void {
    this.eventosService.eventoDetalle(this.idEvento).subscribe(
        res => {
          this.infoEvento = res.data[0];
          this.loaderReservaciones = true;
          if ( this.infoEvento.dias !== null){
            const dias = JSON.parse(this.infoEvento.dias);
            const diasComa: string = dias.join(", ");
            this.diasEvento = diasComa;
            this.diasSemana(dias);
          }

          this.fotografiasArray = res.data[0].fotografias;
          this.videosArray = res.data[0].videos;
          this.arrayUnion = [...this.fotografiasArray, ...this.videosArray];
          this.fotografiasArray = this.fotografiasArray.map(foto => {
            // Iteramos sobre cada propiedad del objeto
            for (const prop in foto) {
              // Verificamos si el valor es igual a la cadena "null" y lo convertimos a null
              if (foto[prop] === 'null') {
                foto[prop] = null;
              }
            }
            return foto;
          });
          this.obtenerListaRecurrencia();
          this.convertirFechaHora(this.infoEvento);
          this.load_cat_estados();
          this.obtenerNombreMunicipios();
          this.obtenerNombreLocalidades();
        });
  }
  regresar(){
    this.router.navigate(['/tabs/eventos'], {
      queryParams: {
        special: true
      }
    });
  }

  obtenerListaRecurrencia() {
    this.eventosService.recurrenciaLista().subscribe(
        res => {
          this.infoRecurrencia = res.data;
        });
  }

  public load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
        response => {
          if (this.utils.is_success_response(response.code)) {
            this.list_cat_estado = response.data.list_cat_estado;
            this.list_cat_estado.forEach(element => {
              if (element.id_estado === this.infoEvento.id_estado) {
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
          this.loaderReservaciones = true;
          if (this.utils.is_success_response(res.code)) {
            this.list_cat_localidad = res.data.list_cat_localidad;
            this.list_cat_localidad.forEach(element => {
              if (element.id_localidad === this.infoEvento.id_localidad) {
                this.nombreLocalidad = element.nombre + ', ';
              }
            });
          }
        }, error => {
          this.notificaciones.error(error);
        });
  }

  convertirFechaHora(infoEvento: any){
    const fecha = infoEvento.fecha;
    if ( fecha !== null){
      const fechaObjeto = new Date(fecha);
      this.numeroDia = fechaObjeto.getDate();
      this.numeroMes = fechaObjeto.getMonth();
      this.anio = fechaObjeto.getFullYear();
      //this.hora12h = fechaObjeto.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
      this.hora12h = fechaObjeto.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
    } else if ( fecha === null){
      this.hora12h = this.infoEvento.hora;
    }
  }


  public guardar(){
    const nPersonas = this.noPersonas;
    const eventoId = this.infoEvento.id_evento;
    if (this.fechaSeleccionadaDiario !== null){
      const fechaDiario = new Date(this.fechaSeleccionadaDiario);
      const anio = fechaDiario.getFullYear();
      const mes =  fechaDiario.getMonth() + 1;
      const dia = fechaDiario.getDate();
      this.fechaReservacionDiario = anio + '-' + mes + '-' + dia;
    }

    if (this.fechaSeleccionada === null || this.fechaSeleccionada === undefined || this.fechaSeleccionada === ''){
      const fechaReservacion1 = new Date(this.infoEvento.fecha);
      const year = fechaReservacion1.getFullYear();
      const month = ('0' + (fechaReservacion1.getMonth() + 1)).slice(-2);
      const day = ('0' + fechaReservacion1.getDate()).slice(-2);
      this.fechaReservacion = year + '-' + month + '-' + day;
    }
    if (this.fechaSeleccionadaDiario !== null){
      this.cadenaReservacion = [eventoId, this.idPersona, this.fechaReservacionDiario, nPersonas];
    }else {
      this.cadenaReservacion = [eventoId, this.idPersona, this.fechaReservacion, nPersonas];
    }
    this.generarReservacion(this.cadenaReservacion);
    this.eventosService.setReservacionObj(this.cadenaReservacion);
    this.mensajeRegistro();
    // this.router.navigate(['/tabs/eventos/generar-reservacion'], { state: { cadena: this.cadenaReservacion } });
  }

  generarReservacion(reservacion: any): void{
    const detalles = reservacion;
    this.eventosService.realizarReservacion(detalles).subscribe(res => {
      this.detalleReser = res.data;
    });
  }

  limpiarFiltro(){
    this.router.navigate(['/tabs/eventos']);
    this.mostrarLabel = false;
    this.fechaSeleccionada = null;
    this.fechaFormat = null;
    this.fechaSeleccionadaDiario = null;
    this.noPersonas = null;
  }

  async mensajeRegistro() {
    setTimeout(async () => {
      this.limpiarFiltro();
      const alert = await this.alertController.create({
        header: 'Bituyú',
        message: 'Su reservación ya fue realizada \n espere su confirmación',
      });
      await alert.present();
    }, 400);
  }

  filtro(){
    this.fechaSeleccionadaDiario = null;
    this.fechaSeleccionada = null;
    this.noPersonas = null;
    this.mostrarLabel = false;
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
}
