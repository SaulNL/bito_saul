import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventosService} from '../../api/eventos.service';
import {CatEstadoModel} from '../../Modelos/CatEstadoModel';
import {GeneralServicesService} from '../../api/general-services.service';
import {UtilsCls} from '../../utils/UtilsCls';
import {ToadNotificacionService} from '../../api/toad-notificacion.service';
import {CatMunicipioModel} from '../../Modelos/CatMunicipioModel';
import {CatLocalidadModel} from '../../Modelos/CatLocalidadModel';
import {FiltroEventosModel} from '../../Modelos/FiltroEventosModel';
import {AlertController, IonContent} from '@ionic/angular';
import {AfiliacionPlazaModel} from '../../Modelos/AfiliacionPlazaModel';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public existeSesion: boolean;
  public user: any;
  opciones: string[] = ['Hoy', 'Mañana', 'Esta semana', 'Este mes'];
  public dias: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public tipoEvento: any;
  public eventosDatos: any;
  public eventoSeleccionado: any;
  public objeto: number;
  public numDia: any;
  public eventosAll: any;
  public numeroDia: number;
  public numeroMes: number;
  public banderaEvento: boolean = false;
  public banderaLista: boolean;
  public id_evento: any;
  public negocio: string;
  public loader: any;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  isOpen: boolean = false;
  public isAlert: boolean = false;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public objectSelectAfiliacionPlaza: AfiliacionPlazaModel;
  public filtroEvento: FiltroEventosModel;
  public inicioFiltro: FiltroEventosModel;
  public btnEstado: boolean;
  public btnMuncipio: boolean;
  public btnLocalidad: boolean;
  public estadoAux: any;
  public municiAux: any;
  public localiAux: any;
  public id_estado: any;
  public id_municipio: any;
  public id_localidad: any;
  public noOpcion: any;
  public fechaSeleccionada: string;
  public afi: any;
  public org: any;
  public idOrg: any;
  public filtroVacio: any;
  public secion: boolean;
  public fecha: any;
  public fechaActual: string;
  public fechaDosMeses: string;
  public parametros: any;

  constructor(
      private eventosService: EventosService,
      private notificaciones: ToadNotificacionService,
      private router: Router,
      private route: ActivatedRoute,
      private _general_service: GeneralServicesService,
      private _utils_cls: UtilsCls,
      public alertController: AlertController,
  ) {
    this.eventosDatos = [];
    this.tipoEvento = [];
    this.eventosAll = [];
    this.filtroEvento = new FiltroEventosModel();
    this.inicioFiltro = new FiltroEventosModel();
    this.eventoSeleccionado = [];
    this.btnEstado = false;
    this.btnMuncipio = true;
    this.btnLocalidad = true;
    this.loader = false;
    this.loaderReservaciones = false;
    //this.obtenerListaTipoEvento();
    this.list_cat_estado = new Array<CatEstadoModel>();
    this.list_cat_municipio = new Array<CatMunicipioModel>();
    this.list_cat_localidad = new Array<CatLocalidadModel>();
    this.user = this._utils_cls.getUserData();
    this.existeSesion = _utils_cls.existe_sesion();
  }

  ngOnInit() {
    let idP = JSON.parse(localStorage.getItem('u_data'));
    if(idP){
      this.secion = !idP.id_persona ?  false : true;
    }
    this.banderaLista = true;
    this.load();

  }

  ionViewWillEnter(){
    this.afi = localStorage.getItem('afi');
    if (this.afi != null){
      this.org = JSON.parse(localStorage.getItem('org'));
      this.idOrg = this.org.id_organizacion;
      this.obtenerListaEvento(this.idOrg);
      this.load();
    }else {
      this.filtroVacio = null;
      this.obtenerListaEvento(this.filtroVacio);
    }
    this.load_cat_estados();
  }

  regresar() {
    this.router.navigate(['/tabs/inicio'], {
      queryParams: {
        special: true
      }
    });
  }

  activarDetalles(){
    if(!this.banderaEvento){
      this.banderaLista = true;
    }else{
      this.banderaLista = false;
    }
  }

  obtenerListaEvento(filtro: any): void {
    const idDetalle = filtro;
    const fechaActual = new Date();
    this.fecha = fechaActual;
    this.obtenerFechaActual(this.fecha);
    if ( idDetalle !== null ){
      this.inicioFiltro.organizacion = idDetalle;
      this.inicioFiltro.fecha_inicio = this.fechaActual;
      this.inicioFiltro.fecha_fin = this.fechaDosMeses;
    } else {
      this.inicioFiltro.fecha_inicio = this.fechaActual;
      this.inicioFiltro.fecha_fin = this.fechaDosMeses;
    }

    this.eventosService.eventosLista(this.inicioFiltro).subscribe(
        res => {
          this.eventosAll = res.data;
          this.eventosAll = this.eventosAll.filter((objeto) => {
            const fechaA = objeto.fecha >= this.fechaActual;
            const recurrencia = objeto.id_tipo_recurrencia === 1 || objeto.id_tipo_recurrencia === 3;
            return fechaA || recurrencia;
          });
          this.loaderReservaciones = true;
          this.eventosAll.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return fechaA.getTime() - fechaB.getTime();
          });
        });
  }

  /*
  obtenerListaTipoEvento() {
    this.eventosService.tipoEventoLista().subscribe(
        res => {
          this.tipoEvento = res.data;
        });
  }
   */

  reservacion(){
    this.router.navigate(['/tabs/eventos/reservaciones'], {
      queryParams: {
        special: true
      }
    });
  }

  datosEventos(id: number): void {
    this.objeto = id;
    if (!this.existeSesion){
      this.mensajeRegistro();
    }else{
      this.router.navigateByUrl(`/tabs/eventos/reservaciones/${id}`);
    }
  }

  convertirFecha(fecha: string): string{
    const fechaObjeto = new Date(fecha);
    this.numDia = fechaObjeto.getDay();
    this.numeroDia = fechaObjeto.getDate();
    this.numeroMes = fechaObjeto.getMonth();
    const diaEscrito = this.dias[this.numDia];
    const diaNumero = this.numeroDia;
    const mesEscrito = this.meses[this.numeroMes];

    const numAño = fechaObjeto.getFullYear();
    const numeroM = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');

    this.fecha = `${numAño}-${numeroM}-${diaNumero}`;

    return `${diaEscrito} ${diaNumero} de ${mesEscrito}`;
  }
  obtenerFechaActual(fecha: string){
    const fechaObjeto = new Date(fecha);
    const numeroDia = fechaObjeto.getDate();
    const numAño = fechaObjeto.getFullYear();
    const numeroM = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
    //Se agregar la fecha del rango
    const dosMeses = (fechaObjeto.getMonth() + 2).toString().padStart(2, '0');
    this.fechaDosMeses = `${numAño}-${dosMeses}-${numeroDia}`;
    this.fechaActual = `${numAño}-${numeroM}-${numeroDia}`;
  }

  convertirDias(dias: any){
    const diasArray = JSON.parse(dias);
    const diasArray2 = diasArray.dias ? diasArray.dias : diasArray;
    const diasComa: string = diasArray2.join(", ");
    return `${diasComa}`;
  }

  abrirModal(){
    this.isOpen = true;
  }

  cerrarModal(){
    this.isOpen = false;
    this.noOpcion = null;
    this.fechaSeleccionada = null;
    this.eventoSeleccionado = null;
    this.filtroEvento.id_estado = null;
    this.filtroEvento.id_municipio = null;
    this.btnMuncipio = true;
    this.filtroEvento.id_localidad = null;
    this.btnLocalidad = true;
  }

  misReservaciones(){
    if (!this.existeSesion){
      this.mensajeRegistro();
    }else{
      localStorage.setItem('openReser', '2');
      this.router.navigate(['/tabs/eventos/mis-reservaciones']);
    }
  }

  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
        response => {
          if (this._utils_cls.is_success_response(response.code)) {
            this.list_cat_estado = response.data.list_cat_estado;
            this.list_cat_estado.forEach(element => {
              if (element.id_estado === this.filtroEvento.id_estado) {
                this.estadoAux = element.nombre;
              }
            });
            // this.loader = false;
            if (this.id_estado > 0) {
              this.get_list_cat_municipio({ value: this.filtroEvento.id_estado });
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
      // this.negocioTO.det_domicilio.id_municipio = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderMunicipio = true;
      this._general_service.getMunicipiosAll(idE).subscribe(
          response => {
            if (this._utils_cls.is_success_response(response.code)) {
              this.list_cat_municipio = response.data.list_cat_municipio;
              this.list_cat_municipio.forEach(element => {
                if (element.id_municipio === this.filtroEvento.id_municipio) {
                  this.municiAux = element.nombre;
                }
              });
              this.btnMuncipio = false;
              if (this.id_municipio > 0) {
                this.btnMuncipio = false;
                this.get_list_cat_localidad({ value: this.filtroEvento.id_municipio });
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
      // this.negocioTO.det_domicilio.id_localidad = [];
      idE = evento.detail.value;
    } else {
      idE = evento.value;
    }
    if (idE > 0) {
      // this.loaderLocalidad = true;

      this._general_service.getLocalidadAll(idE).subscribe(
          response => {
            if (this._utils_cls.is_success_response(response.code)) {
              this.btnLocalidad = false;
              this.list_cat_localidad = response.data.list_cat_localidad;
              this.list_cat_localidad.forEach(element => {
                if (element.id_localidad === this.id_localidad) {
                  this.localiAux = element.nombre;

                }
              });
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

  limpiarFiltro(){
    this.fechaSeleccionada = null;
    this.eventoSeleccionado = null;
    this.filtroEvento.id_estado = null;
    this.filtroEvento.id_municipio = null;
    this.btnMuncipio = true;
    this.filtroEvento.id_localidad = null;
    this.btnLocalidad = true;

    if (this.afi != null){
      this.org = JSON.parse(localStorage.getItem('org'));
      this.idOrg = this.org.id_organizacion;
      this.obtenerListaEvento(this.idOrg);
    }else {
      this.filtroVacio = null;
      this.obtenerListaEvento(this.filtroVacio);
    }
  }

  public buscarEvento() {
    this.isOpen = false;
    this.loader = true;
    this.afi = localStorage.getItem('afi');
    if (this.afi != null){
      this.org = JSON.parse(localStorage.getItem('org'));
      this.filtroEvento.organizacion = this.org.id_organizacion;
    }
    if ( this.fechaSeleccionada == null){
      this.filtroEvento.fecha_inicio = this.fechaActual;
      this.filtroEvento.fecha_fin = this.fechaDosMeses;
    }
    this.eventosService.buscarFiltroEvento(this.filtroEvento).subscribe(
        (response) => {
          this.eventosAll = response.data;
          this.eventosAll = this.eventosAll.filter((objeto) => {
            const fechaA = objeto.fecha >= this.fechaActual;
            const recurrencia = objeto.id_tipo_recurrencia === 1 || objeto.id_tipo_recurrencia === 3;
            return fechaA || recurrencia;
          });
          this.eventosAll.sort((a, b) => {
            const fechaA = new Date(a.fecha);
            const fechaB = new Date(b.fecha);
            return fechaA.getTime() - fechaB.getTime();
          });
        },
        (error) => {
        });
  }

  cargarFecha(event: any): void{
    const seleccion = event.target.value;
    const opcion = new Date();
    const year = opcion.getFullYear();
    const month = ('0' + (opcion.getMonth() + 1)).slice(-2);
    const day = ('0' + opcion.getDate()).slice(-2);
    const fecha = year + '-' + month + '-' + day;

    if ( seleccion === 'Hoy'){
      this.filtroEvento.fecha_inicio = fecha;
      this.filtroEvento.fecha_fin = fecha;
    }else if ( seleccion === 'Semana'){
      // Agrego los 7 dias de mas
      opcion.setDate(opcion.getDate() + 7);
      const year1 = opcion.getFullYear();
      const month1 = ('0' + (opcion.getMonth() + 1)).slice(-2);
      const day1 = ('0' + opcion.getDate()).slice(-2);
      const fecha1 = year1 + '-' + month1 + '-' + day1;
      this.filtroEvento.fecha_inicio = fecha;
      this.filtroEvento.fecha_fin = fecha1;
    }else if ( seleccion === 'Mes actual'){
      // Agrego los 31 dias de mas
      opcion.setDate(opcion.getDate() + 31);
      const year2 = opcion.getFullYear();
      const month2 = ('0' + (opcion.getMonth() + 1)).slice(-2);
      const day2 = ('0' + opcion.getDate()).slice(-2);
      const fecha2 = year2 + '-' + month2 + '-' + day2;
      this.filtroEvento.fecha_inicio = fecha;
      this.filtroEvento.fecha_fin = fecha2;
    }
  }

  cerrarAlert(isAlert: boolean){
    this.isAlert = isAlert;
  }

  borrarIdEvento(idEvento: number){
    if (idEvento === 1){
      localStorage.removeItem('idEvento');
    }
  }

  async mensajeRegistro() {
    this.isAlert = true;
    localStorage.setItem('idEvento', JSON.stringify(this.objeto));
  }

  private load() {
      this.objectSelectAfiliacionPlaza = JSON.parse(
          String(localStorage.getItem("org"))
      );
  }

}
