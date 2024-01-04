import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsCls} from "../../utils/UtilsCls";
import {PermisoModel} from "../../Modelos/PermisoModel";
import {Auth0Service} from "../../api/busqueda/auth0.service";
import {PlazasAfiliacionesComponent} from "../../componentes/plazas-afiliaciones/plazas-afiliaciones.component";
import {IonContent, ModalController} from '@ionic/angular';
import {FiltroExperienciasModel} from "../../Modelos/FiltroExperienciasModel";
import {Router} from '@angular/router';
import {ExperienciasTuristicasService} from "../../api/experienciasTuristicas/experiencias-turisticas.service";
import {GeneralServicesService} from "../../api/general-services.service";
import {ToadNotificacionService} from "../../api/toad-notificacion.service";
import {CatEstadoModel} from "../../Modelos/CatEstadoModel";
import {CatMunicipioModel} from "../../Modelos/CatMunicipioModel";
import {CatLocalidadModel} from "../../Modelos/CatLocalidadModel";
import {AfiliacionPlazaModel} from "../../Modelos/AfiliacionPlazaModel";

@Component({
  selector: 'app-experiencias-turisticas',
  templateUrl: './experiencias-turisticas.page.html',
  styleUrls: ['./experiencias-turisticas.page.scss'],
})
export class ExperienciasTuristicasPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  public dias: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public persona: number | null;
  public permisos: Array<PermisoModel> | null;
  private modal: any;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  public cordenada: number;
  isOpen: boolean = false;
  public fechaSeleccionada: string;
  public experienciasAll: any;
  public filtroExperiencias: FiltroExperienciasModel;
  public inicioFiltro: FiltroExperienciasModel;
  public objectSelectAfiliacionPlaza: AfiliacionPlazaModel;
  public list_cat_estado: Array<CatEstadoModel>;
  public list_cat_municipio: Array<CatMunicipioModel>;
  public list_cat_localidad: Array<CatLocalidadModel>;
  public fecha: any;
  public fechaActual: string;
  public fechaDosMeses: string;
  public numDia: any;
  public numeroDia: number;
  public numeroMes: number;
  public existeSesion: boolean;
  public isAlert: boolean = false;
  public btnEstado: boolean;
  public btnMuncipio: boolean;
  public btnLocalidad: boolean;
  public estadoAux: any;
  public municiAux: any;
  public localiAux: any;
  public id_estado: any;
  public id_municipio: any;
  public id_localidad: any;
  public filtroVacio: any;
  public afi: any;
  public org: any;
  public idOrg: any;

  constructor(
      private util: UtilsCls,
      private auth0Service: Auth0Service,
      private modalController: ModalController,
      private experienciasService: ExperienciasTuristicasService,
      private router: Router,
      private _general_service: GeneralServicesService,
      private notificaciones: ToadNotificacionService,
  ) {
    if (this.util.existSession()) {
      this.persona = this.util.getIdPersona();
      this.permisos = this.auth0Service.getUserPermisos();
      this.loaderReservaciones = false;
      this.experienciasAll = [];
      this.filtroExperiencias = new FiltroExperienciasModel();
      this.inicioFiltro = new FiltroExperienciasModel();
      this.list_cat_estado = new Array<CatEstadoModel>();
      this.list_cat_municipio = new Array<CatMunicipioModel>();
      this.list_cat_localidad = new Array<CatLocalidadModel>();
      this.existeSesion = util.existe_sesion();
      this.btnEstado = false;
      this.btnMuncipio = true;
      this.btnLocalidad = true;
    }
  }

  ngOnInit() {
    this.load();
  }

  ionViewWillEnter(){
    this.afi = localStorage.getItem('afi');
    if (this.afi != null){
      this.org = JSON.parse(localStorage.getItem('org'));
      this.idOrg = this.org.id_organizacion;
      this.obtenerListaExperiencias(this.idOrg);
      this.load();
    }else {
      this.filtroVacio = null;
      this.obtenerListaExperiencias(this.filtroVacio);
    }
    this.load_cat_estados();
  }

    misReservaciones(){
    if (!this.existeSesion){
      this.mensajeRegistro();
    }else{
      this.router.navigate(['/tabs/experiencias-turisticas/lista-reservacion-experiencias']);
    }
  }

  async regresar(){
    this.experienciasService.setBanderaExp(1);
    this.modal = await this.modalController.create({
      component: PlazasAfiliacionesComponent,
      cssClass: 'custom-modal-plazas-afiliaciones',
      componentProps: {
        idUsuario: this.persona,
        permisos: this.permisos,
      },
    });
    return await this.modal.present();
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

  obtenerListaExperiencias(filtro: any): void {
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
    this.experienciasService.experienciasLista(this.inicioFiltro).subscribe(
        res => {
          this.loaderReservaciones = true;
          this.experienciasAll = res.data;
          this.experienciasAll = this.experienciasAll.filter((objeto) => {
            const fechaA = objeto.fecha_inicio_experiencia >= this.fechaActual;
            const recurrencia = objeto.id_tipo_recurrencia_experiencia === 1 || objeto.id_tipo_recurrencia_experiencia === 3;
            return fechaA || recurrencia;
          });
        });
  }

  convertirDias(dias: any){
    const arregloDias = JSON.parse(dias);
    const diasArray: string = arregloDias.join(', ');
    return `${diasArray}`;
  }

  datosExperiencia(id: number): void {
    this.router.navigateByUrl(`/tabs/experiencias-turisticas/reservacion-experiencia/${id}`);
  }

  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
        response => {
          if (this.util.is_success_response(response.code)) {
            this.list_cat_estado = response.data.list_cat_estado;
            this.list_cat_estado.forEach(element => {
              if (element.id_estado === this.filtroExperiencias.id_estado) {
                this.estadoAux = element.nombre;
              }
            });
            // this.loader = false;
            if (this.id_estado > 0) {
              this.get_list_cat_municipio({ value: this.filtroExperiencias.id_estado });
            }
          }
        },
        error => {
          this.notificaciones.error(error);
        }
    );
  }

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
            if (this.util.is_success_response(response.code)) {
              this.list_cat_municipio = response.data.list_cat_municipio;
              this.list_cat_municipio.forEach(element => {
                if (element.id_municipio === this.filtroExperiencias.id_municipio) {
                  this.municiAux = element.nombre;
                }
              });
              this.btnMuncipio = false;
              if (this.id_municipio > 0) {
                this.btnMuncipio = false;
                this.get_list_cat_localidad({ value: this.filtroExperiencias.id_municipio });
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
            if (this.util.is_success_response(response.code)) {
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

  obtenerFechaActual(fecha: string){
    const fechaObjeto = new Date(fecha);
    const numeroDia = fechaObjeto.getDate();
    const numAño = fechaObjeto.getFullYear();
    const numeroM = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
    // Se agregara la fecha del rango
    const dosMeses = parseInt((fechaObjeto.getMonth() + 3).toString().padStart(2, '0'));
    if (dosMeses > 12) {
      const nuevoAño = dosMeses > 12 ? numAño + 1 : numAño;
      const nuevoMes = (dosMeses % 12) || 12;
      this.fechaDosMeses = `${nuevoAño}-${nuevoMes.toString().padStart(2, '0')}-${numeroDia}`;
    } else {
      this.fechaDosMeses = `${numAño}-${dosMeses.toString().padStart(2, '0')}-${numeroDia}`;
    }
    this.fechaActual = `${numAño}-${numeroM}-${numeroDia}`;
  }

  async mensajeRegistro() {
    this.isAlert = true;
  }

  buscarExperiencia(){
    this.isOpen = false;
    this.loaderReservaciones = true;
    this.afi = localStorage.getItem('afi');
    if (this.afi != null){
      this.org = JSON.parse(localStorage.getItem('org'));
      this.filtroExperiencias.organizacion = this.org.id_organizacion;
    }
    if ( this.fechaSeleccionada == null){
      this.filtroExperiencias.fecha_inicio = this.fechaActual;
      this.filtroExperiencias.fecha_fin = this.fechaDosMeses;
    }
    this.experienciasService.experienciasLista(this.filtroExperiencias).subscribe(
        (response) => {
          this.experienciasAll = response.data;
          this.experienciasAll = this.experienciasAll.filter((objeto) => {
            const fechaA = objeto.fecha_inicio_experiencia >= this.fechaActual;
            const recurrencia = objeto.id_tipo_recurrencia_experiencia === 1 || objeto.id_tipo_recurrencia_experiencia === 3;
            return fechaA || recurrencia;
          });
        },
        (error) => {
        });
  }

  limpiarFiltro(){
    this.fechaSeleccionada = null;
    this.filtroExperiencias.id_estado = null;
    this.filtroExperiencias.id_municipio = null;
    this.btnMuncipio = true;
    this.filtroExperiencias.id_localidad = null;
    this.btnLocalidad = true;

    if (this.afi != null){
      this.org = JSON.parse(localStorage.getItem('org'));
      this.idOrg = this.org.id_organizacion;
      this.obtenerListaExperiencias(this.idOrg);
    }else {
      this.filtroVacio = null;
      this.obtenerListaExperiencias(this.filtroVacio);
    }
  }

  cargarFecha(event: any): void{
    const seleccion = event.target.value;
    const opcion = new Date();
    const year = opcion.getFullYear();
    const month = ('0' + (opcion.getMonth() + 1)).slice(-2);
    const day = ('0' + opcion.getDate()).slice(-2);
    const fecha = year + '-' + month + '-' + day;

    if ( seleccion === 'Hoy'){
      this.filtroExperiencias.fecha_inicio = fecha;
      this.filtroExperiencias.fecha_fin = fecha;
    }else if ( seleccion === 'Semana'){
      // Agrego los 7 dias de mas
      opcion.setDate(opcion.getDate() + 7);
      const year1 = opcion.getFullYear();
      const month1 = ('0' + (opcion.getMonth() + 1)).slice(-2);
      const day1 = ('0' + opcion.getDate()).slice(-2);
      const fecha1 = year1 + '-' + month1 + '-' + day1;
      this.filtroExperiencias.fecha_inicio = fecha;
      this.filtroExperiencias.fecha_fin = fecha1;
    }else if ( seleccion === 'Mes actual'){
      // Agrego los 31 dias de mas
      opcion.setDate(opcion.getDate() + 31);
      const year2 = opcion.getFullYear();
      const month2 = ('0' + (opcion.getMonth() + 1)).slice(-2);
      const day2 = ('0' + opcion.getDate()).slice(-2);
      const fecha2 = year2 + '-' + month2 + '-' + day2;
      this.filtroExperiencias.fecha_inicio = fecha;
      this.filtroExperiencias.fecha_fin = fecha2;
    }
  }

  private load() {
    this.objectSelectAfiliacionPlaza = JSON.parse(
        String(localStorage.getItem('org'))
    );
  }

  abrirModal(){
    this.isOpen = true;
  }
  cerrarModal(){
    this.isOpen = false;
  }
  cerrarAlert(isAlert: boolean){
    this.isAlert = isAlert;
  }

}
