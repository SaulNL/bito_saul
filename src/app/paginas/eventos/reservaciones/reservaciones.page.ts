import { Component, OnInit } from '@angular/core';
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
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.page.html',
  styleUrls: ['./reservaciones.page.scss'],
})
export class ReservacionesPage implements OnInit {
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public idEvento: string;
  public infoEvento: any;
  public detalleReser: any;
  public cadenaReservacion: any;
  mostrarLabel: boolean;
  public infoRecurrencia: any;
  public nombreRecurrencia: any;
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

  fechaSeleccionadaDiario: string;
  fechaSeleccionada: string;
  mesSeleccionado: string;
  minFecha: string;
  maxFecha: string;
  semanasArray: Date[];
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


  public fechaFormateada: any;

  constructor(
      private eventosService: EventosService,
      private route: ActivatedRoute,
      private router: Router,
      private utils: UtilsCls,
      private _general_service: GeneralServicesService,
      private notificaciones: ToadNotificacionService,
      public alertController: AlertController,
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
    const idEvento = localStorage.getItem('idEvento');
    if (idEvento != null){
      localStorage.removeItem('idEvento');
      location.reload();
    }
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.route.paramMap.subscribe(params => {
      this.idEvento = params.get('id');
      this.obtenerListaEvento();
    });
    this.idPersona = (this.utils.existSession()) ? this.utils.getIdUsuario() : null;
    this.base64Video = null;
    this.reservacionPorFechas();
    this.mostrarSemanal();
  }

  obtenerListaEvento(): void {
    this.eventosService.eventoDetalle(this.idEvento).subscribe(
        res => {
          this.infoEvento = res.data;
          this.fotografiasArray = res.data[0].fotografias;
          this.videosArray = res.data[0].videos;
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
          this.convertirFechaHora();
          this.load_cat_estados();
          this.obtenerNombreMunicipios();
          this.obtenerNombreLocalidades();
          this.reservacionPorFechas();
          this.mostrarSemanal();
          this.mostrarMeses();
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
          this.obtenerNombreRecurrencia();
        });

  }

  obtenerNombreRecurrencia(){
    this.infoRecurrencia.forEach(response => {
      if (response.id_tipo_recurrencia === this.infoEvento[0]?.id_tipo_recurrencia){
        this.nombreRecurrencia = response.nombre;
        this.loaderReservaciones = true;
      }
    });

  }

  public load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
        response => {
          if (this.utils.is_success_response(response.code)) {
            this.list_cat_estado = response.data.list_cat_estado;
            this.list_cat_estado.forEach(element => {
              if (element.id_estado == this.infoEvento[0]?.id_estado) {
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

  convertirFechaHora(){
    const fecha = this.infoEvento[0]?.fecha;
    const fechaObjeto = new Date(fecha);
    this.numeroDia = fechaObjeto.getDate();
    this.numeroMes = fechaObjeto.getMonth();
    this.anio = fechaObjeto.getFullYear();
    this.hora12h = fechaObjeto.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  reservacionPorFechas(){
  if ( this.infoEvento[0]?.id_tipo_recurrencia === 2){
      const fechaReservacion = new Date(this.infoEvento[0]?.fecha);
      const fechaActual = new Date();
      if ( fechaReservacion < fechaActual){
        this.minFecha = fechaActual.toISOString();
        const fechaMaxima = new Date();
        fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 1);
        this.maxFecha = fechaMaxima.toISOString();
      }else{
        this.minFecha = fechaReservacion.toISOString();
        const fechaMaxima = new Date();
        fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 1);
        this.maxFecha = fechaMaxima.toISOString();
      }

    }
  }

  mostrarSemanal() {
    this.semanasArray = [];
    const fechaEvento = new Date(this.infoEvento[0]?.fecha);
    const fechaActual = new Date();

    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth();
    const diaActual = fechaActual.getDate();

    const numDia = fechaEvento.getDay();

    let fecha = new Date(anioActual, mesActual, diaActual);

    // Si la fecha ya pasó, avanzar a la siguiente semana
    if (fecha < fechaEvento) {
      fecha = new Date(fechaEvento.getFullYear(), fechaEvento.getMonth(), fechaEvento.getDate());
    }

    // Iterar mientras estemos en el mismo año
    while (fecha.getFullYear() === anioActual) {
      if (fecha.getDay() === numDia) {
        this.fechaFormateada = format(fecha, 'dd/MMMM/yyyy', { locale: es });
        this.semanasArray.push(this.fechaFormateada);
      }

      fecha.setDate(fecha.getDate() + 1); // Avanzar a la siguiente semana
    }
  }



  mostrarMeses() {
    const fechaActual = new Date(this.infoEvento[0]?.fecha);
    const dia = fechaActual.getDate();
    let año = fechaActual.getFullYear();
    let mes = fechaActual.getMonth();

    const fechaHoy = new Date(); // Obtener fecha actual

    for (let i = 0; i < 12; i++) {
      const date = new Date(año, mes, dia);
      this.fechaFormateada = format(date, 'dd/MMMM/yyyy', { locale: es });

      if (date >= fechaHoy) { // Comprobar si la fecha es igual o posterior a la fecha actual
        this.mesesArray.push(this.fechaFormateada);
      }

      mes++;
      if (mes > 11) {
        mes = 0;
        año++;
      }
    }
  }


  public guardar(){
    const nPersonas = this.noPersonas;
    const eventoId = this.infoEvento[0]?.id_evento;
    if (this.fechaSeleccionadaDiario !== null){
      const fechaDiario = new Date(this.fechaSeleccionadaDiario);
      const anio = fechaDiario.getFullYear();
      const mes =  fechaDiario.getMonth() + 1;
      const dia = fechaDiario.getDate();
      this.fechaReservacionDiario = anio + '-' + mes + '-' + dia;
    }

    if ( this.fechaSeleccionada !== null ){
      const fechaStr = this.fechaSeleccionada;
      const meses = {
        enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
      };
      const [day, month, year] = fechaStr.split('/');
      this.fechaReservacion = year + '-' + meses[month] + '-' + day;
    }else if (this.fechaSeleccionada === null || this.fechaSeleccionada === undefined || this.fechaSeleccionada === ''){
      const fechaReservacion1 = new Date(this.infoEvento[0]?.fecha);
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
    this.fechaSeleccionadaDiario = null;
    this.noPersonas = null;
  }

  async mensajeRegistro() {
    setTimeout(async () => {
      this.limpiarFiltro();
      const alert = await this.alertController.create({
        header: 'Bituyú!',
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

}
