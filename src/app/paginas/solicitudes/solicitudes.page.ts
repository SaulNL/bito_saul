import { SolicitudesService } from './../../api/solicitudes.service';
import { Component, OnInit } from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { DetDomicilioModel } from 'src/app/Modelos/busqueda/DetDomicilioModel';
import { ActionSheetController } from '@ionic/angular';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {
  public usuario: any;
  public id_proveedor:any;
  public id_persona:any;
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
  constructor(
    private solicitudesService: SolicitudesService,
    public actionSheetController: ActionSheetController,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController,
  ) { }

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
        }
      },{
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
  buscar(){
   // this.cancelarEdicion();
    this.seleccionTO.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.seleccionTO.id_persona = this.usuario.id_persona;
    this.solicitudesService.buscar(this.seleccionTO).subscribe(
      response => {
        this.lstSolicitudes = response.data;
        //this.lstSolicitudesBK = response.data;
       // this.filtro = undefined;
       // this.obtenerNumeroPublicacionesSolicitud();
       // this.obtenerSolcitudesPublicadas();
       // this.obtenerDiasPublicacionesSolicitud();
      },
      error => {
       this.notificaciones.error(error);
      }
    );
  }
   /**
   * Funcion para mostar detalle de solicitud
   * @param solicitud
   */
  seleccionarSolicitud(solicitud){
    this.blnActivarFormularioEdicion = false;
    this.blnActivaListaSolictud = false;
    this.seleccionaSolicitud = true;
    this.accionFormulario = 'Detalle';
    this.solicitud = solicitud;
    this.filtro = solicitud.solicitud;
    //this.btnBuscar();
  }
  cerrarSolicitud(){
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
}
