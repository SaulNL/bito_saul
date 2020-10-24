import { SolicitudesService } from './../../api/solicitudes.service';
import { Component, OnInit } from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { DetDomicilioModel } from 'src/app/Modelos/busqueda/DetDomicilioModel';
import { ActionSheetController } from '@ionic/angular';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { PublicacionesModel } from 'src/app/Modelos/PublicacionesModel';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {
  public usuario: any;
  public id_proveedor: any;
  public id_persona: any;
  public blnActivarFormularioEdicion: boolean;
  public seleccionaSolicitud: boolean;
  public blnActivaListaSolictud: boolean;
  public lstSolicitudes: Array<SolicitudesModel>;
  public lstSolicitudesBK: Array<SolicitudesModel>;
  public lstSolicitudesPublicadas: Array<SolicitudesModel>;
  public lstSolicitudesPublicadasBK: Array<SolicitudesModel>;
  public seleccionTO: SolicitudesModel;
  public solicitud: SolicitudesModel;
  public filtro: any;
  public accionFormulario: string;
  public loader: any;
  public fechaini: any;
  public fechafin: any;
  public publicacionesHechas: number;
  public publicacionesPermitidas: number;
  public mensajePublicacion = false;
  public blnSelectFecha = false;
  public publicacion: PublicacionesModel;
  public diasPermitidos: number;
  public modalPublicacion: boolean;
  public mensajeValidacion = false;
  public minDate: any;
  public maxDate: any;
  public blnAdminPublicadas: boolean;
  public blnSolicitud: boolean;
  public seleccionadoAdmin: SolicitudesModel;
  public blnDejaPublicar: boolean;
  constructor(
    private solicitudesService: SolicitudesService,
    public actionSheetController: ActionSheetController,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController,
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear - -30, 0, 0);
    this.minDate = moment.parseZone(this.minDate).format("YYYY-MM-DD");
    this.maxDate = moment.parseZone(this.maxDate).format("YYYY-MM-DD");
  }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.id_persona = this.usuario.id_persona;
    this.blnActivaListaSolictud = true;
    this.blnActivarFormularioEdicion = false;
    this.seleccionaSolicitud = false;
    this.seleccionTO = new SolicitudesModel();
    this.buscar();
    this.solicitud = new SolicitudesModel();
    this.seleccionadoAdmin = new SolicitudesModel();
    this.publicacionesHechas = 0;
    this.publicacionesPermitidas = 0;
    this.diasPermitidos = 0;
    this.modalPublicacion = false;
    this.blnAdminPublicadas = false;
    this.blnSolicitud = false;
    this.blnDejaPublicar = false;
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Solicitudes',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Agregar Solicitud',
        icon: 'add-circle-outline',
        handler: () => {
          //   this._router.navigate(['/tabs/datos-basicos']);
          this.agregar();
        }
      }, {
        text: 'Publicaciones',
        icon: 'reader-outline',
        handler: () => {
          //  this._router.navigate(['/tabs/cambio-contrasenia']);
          this.abriAdminPublicadas();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  /**
 * Funcion para buscar solicitudes
 * @author Omar
 */
  buscar() {
    // this.cancelarEdicion();
    this.seleccionTO.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.seleccionTO.id_persona = this.usuario.id_persona;
    this.solicitudesService.buscar(this.seleccionTO).subscribe(
      response => {
        this.lstSolicitudes = response.data;
        this.lstSolicitudesBK = response.data;
        this.filtro = undefined;
        this.obtenerNumeroPublicacionesSolicitud();
        this.obtenerSolcitudesPublicadas();
        this.obtenerDiasPublicacionesSolicitud();
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  /**
 * Funcion para obtener las publicaciones
 * @author Omar
 */
  public obtenerSolcitudesPublicadas() {
    this.loader = true;
    this.solicitudesService.obtenerSolcitudesPublicadas(this.seleccionTO).subscribe(response => {
      this.lstSolicitudesPublicadas = response.data;
      this.lstSolicitudesPublicadasBK = response.data;
      // this.loader = false;
    },
      error => {
        this.notificaciones.error(error);
        // this.loader = false;
      });
  }
  /**
  * Funcion para mostar detalle de solicitud
  * @param solicitud
  */
  seleccionarSolicitud(solicitud) {
    this.blnActivarFormularioEdicion = false;
    this.blnActivaListaSolictud = false;
    this.seleccionaSolicitud = true;
    this.accionFormulario = 'Detalle';
    this.solicitud = solicitud;
    // this.filtro = solicitud.solicitud;
    //this.btnBuscar();
  }
  cerrarSolicitud() {
    this.blnActivarFormularioEdicion = false;
    this.seleccionaSolicitud = false;
    this.blnActivaListaSolictud = true;
  }
  agregar() {
    this.seleccionTO = new SolicitudesModel();
    this.seleccionTO.det_domicilio = new DetDomicilioModel();
    this.blnActivarFormularioEdicion = true;
    this.seleccionaSolicitud = false;
    this.blnActivaListaSolictud = false;
    this.accionFormulario = 'Agregar solcitud';
  }
  /**
   * Funcion para modificar solicitud
   * @param seleccionTO
   * @author Omar
   */
  public modificar(seleccionTO: SolicitudesModel) {
    // this.btnBlockedNuevo = true;
    this.blnActivarFormularioEdicion = true;
    this.seleccionaSolicitud = false;
    this.blnActivaListaSolictud = false;
    this.seleccionTO = seleccionTO;
    this.accionFormulario = 'Modificar Solicitud';
  }
  /**
  * funcion para obtener cifras de las promociones
  * @author Omar
  */
  obtenerNumeroPublicacionesSolicitud() {
    this.solicitudesService.obtenerNumeroPublicacionesSolicitud(this.id_persona).subscribe(
      response => {
        this.publicacionesHechas = response.data.numPublicacionesSoli;
        this.publicacionesPermitidas = response.data.numPubliSoliPermitidas;
        this.loader = false;
      },
      error => {
        //  this._notificacionService.pushError(error);
        this.loader = false;
      }
    );
  }

  /**
   * funcion para obtener los dias permitidos de publicacion
   * @author Omar
   */
  obtenerDiasPublicacionesSolicitud() {
    this.solicitudesService.obtenerDiasPublicacionesSolicitud(this.id_persona).subscribe(
      response => {
        this.diasPermitidos = response.data.numDiasPromoPublicacion;
      },
      error => {
        // this._notificacionService.pushError(error);
      }
    );
  }
  /**
   * Funcion para abrir modal de publicacion
   * @param modal
   * @param solicitud
   */
  public abrirModal(solicitud: SolicitudesModel) {
    if (this.publicacionesHechas >= this.publicacionesPermitidas) {
      this.mensajePublicacion = true;
    }
    this.blnSelectFecha = false;
    this.publicacion = new PublicacionesModel();
    this.publicacion.id_solicitud = solicitud.id_solicitud;
    this.modalPublicacion = true;
    this.seleccionaSolicitud = false;
    /* this.modal_reference = this._modalService.open(modal, {
       backdrop: 'static',
       keyboard: false,
       centered: true,
       windowClass: 'animated slideInUp'
     });*/
  }
  cancelarPublicacion() {
    this.mensajeValidacion = false;
    this.mensajePublicacion = false;
    this.modalPublicacion = false;
    this.seleccionaSolicitud = true;
  }
  /**
   * Fucnion para verificar publicaciones disponibles
   * @author Omar
   */
  verificacionPublicaciones() {
    if (this.publicacionesHechas >= this.publicacionesPermitidas) {
      return false;
    } else {
      return true;
    }
  }
  calcularRangoFechas() {
    let ini = moment(this.fechaini);
    let fin = moment(this.fechafin);
    let diff = fin.diff(ini, 'days');
    if (diff < this.diasPermitidos) {
      this.blnSelectFecha = false;
    } else {
      this.blnSelectFecha = true;
    }
  }
  /**
 * Funcion para publicar una promocion
 * @param form
 * @author Omar
 */
  guardarPublicacion(form: NgForm) {
    this.presentLoading();
    let fechaInicio = Date.parse(this.fechaini);
    this.fechaini = new Date(fechaInicio);
    let fechaFinal = Date.parse(this.fechafin);
    this.fechafin = new Date(fechaFinal);
    if (form.valid && this.blnSelectFecha === false) {
      this.mensajeValidacion = false;
      if (this.verificacionPublicaciones()) {
        this.mensajePublicacion = false;
        //   this.loaderBtn = true;
        this.publicacion.fecha_inicio = this.fechaini;
        this.publicacion.fecha_fin = this.fechafin;
        this.publicacion.id_proveedor = this.seleccionTO.id_proveedor;
        this.publicacion.id_persona = this.seleccionTO.id_persona;
        this.solicitudesService.guardarPublicacion(this.publicacion).subscribe(
          (response: any) => {

            if (response.code === 200) {
              this.loader.dismiss();
              this.notificaciones.exito('Se público correctamente la solicitud');
              this.cancelarPublicacion();
              form.resetForm();
              this.buscar();
            } else {
              this.loader.dismiss();
              this.notificaciones.alerta(response.message);
            }

            // this.loaderBtn = false;
          },
          error => {
            this.loader.dismiss();
            this.notificaciones.error(error);
          }
        );
      } else {
        this.mensajePublicacion = true;
      }
    } else {
      this.mensajeValidacion = true;
    }
  }
  btnBuscar(e) {
    this.filtro = e.target.value;
    this.lstSolicitudesPublicadas = this.lstSolicitudesPublicadasBK;
    this.lstSolicitudesPublicadas = this.lstSolicitudesPublicadas.filter(element => {
      return element.solicitud.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1
        || element.descripcion.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1;
    });
  }
  abriAdminPublicadas() {
    this.blnAdminPublicadas = true;
    this.blnActivaListaSolictud = false;
  }
  cerrarAdminPublicadas() {
    this.blnAdminPublicadas = false;
    this.blnActivaListaSolictud = true;
  }
  selecAdminPublicada(solicitud: any) {
    this.seleccionadoAdmin = solicitud;
    this.blnAdminPublicadas = false;
    this.blnSolicitud = true;
  }
  cerrarSeleAdminPublicada() {
    this.blnAdminPublicadas = true;
    this.blnSolicitud = false;
  }
  /**
 * Funcion para dejar de publicar una publicacion
 * @param modal
 * @param id_promocion
 * @author Omar
 */
  public abrirModalDejarPublicarPublicacion(solicitud) {
    this.seleccionTO = solicitud;
    this.blnSolicitud = false;
    this.blnDejaPublicar = true;
  }
  /**
   * Funcion para dejar de publicar un publicacion
   * @author Omar
   */
  quitarPublicacion() {
    this.solicitudesService.quitarPublicacion(this.seleccionTO).subscribe(
      response => {
        this.buscar();
        //this.cerrarModal();
      },
      error => {
        //this._notificacionService.pushError(error);
      }
    );
  }
  cerrrarQuitarPublicacion(){
    this.blnSolicitud = true;
    this.blnDejaPublicar = false;
  }

}
