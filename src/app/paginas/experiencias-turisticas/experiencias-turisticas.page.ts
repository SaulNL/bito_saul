import { Component, OnInit, ViewChild } from '@angular/core';
import {UtilsCls} from "../../utils/UtilsCls";
import {PermisoModel} from "../../Modelos/PermisoModel";
import {Auth0Service} from "../../api/busqueda/auth0.service";
import {PlazasAfiliacionesComponent} from "../../componentes/plazas-afiliaciones/plazas-afiliaciones.component";
import {ModalController, IonContent} from '@ionic/angular';
import {FiltroExperienciasModel} from "../../Modelos/FiltroExperienciasModel";
import {Router} from '@angular/router';
import {ExperienciasTuristicasService} from "../../api/experienciasTuristicas/experiencias-turisticas.service";

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
  public tipoExperiencia: string;
  public experienciasAll: any;
  public filtroExperiencias: FiltroExperienciasModel;
  public fecha: any;
  public numDia: any;
  public numeroDia: number;
  public numeroMes: number;

  constructor(
      private util: UtilsCls,
      private auth0Service: Auth0Service,
      private modalController: ModalController,
      private experienciasService: ExperienciasTuristicasService,
      private router: Router,
  ) {
    if (this.util.existSession()) {
      this.persona = this.util.getIdPersona();
      this.permisos = this.auth0Service.getUserPermisos();
      this.loaderReservaciones = false;
      this.experienciasAll = [];
      this.filtroExperiencias = new FiltroExperienciasModel();
    }
  }

  ngOnInit() {
    this.obtenerListaExperiencias();
  }

  async regresar(){
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

  obtenerListaExperiencias(): void {
    this.experienciasService.experienciasLista().subscribe(
        res => {
          this.loaderReservaciones = true;
          this.experienciasAll = res.data;
          console.log('dts', this.experienciasAll);
        });
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

  datosExperiencia(id: number): void {
    this.router.navigateByUrl(`/tabs/experiencias-turisticas/reservacion-experiencia/${id}`);
  }

  buscarExperiencia(){
  }

  limpiarFiltro(){
  }

  abrirModal(){
    this.isOpen = true;
  }
  cerrarModal(){
    this.isOpen = false;
  }

  cargarFecha(event: any): void{
  }

}
