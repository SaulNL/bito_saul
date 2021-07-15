import { SolicitudesService } from './../../api/solicitudes.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { DetDomicilioModel } from 'src/app/Modelos/busqueda/DetDomicilioModel';
import {ActionSheetController, IonContent} from '@ionic/angular';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { PublicacionesModel } from 'src/app/Modelos/PublicacionesModel';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public usuario: any;
  public id_proveedor: any;
  public id_persona: any;
  public lstSolicitudes: Array<SolicitudesModel>;
  public lstSolicitudesBK: Array<SolicitudesModel>;
  public lstSolicitudesPublicadas: Array<SolicitudesModel>;
  public lstSolicitudesPublicadasBK: Array<SolicitudesModel>;
  public seleccionTO: SolicitudesModel;
  public filtro: any;
  public accionFormulario: string;
  public loader: any;
  public numeroSolicitudes: number;
//Admin Solicitudes Publicadas
public solicitud: SolicitudesModel;
public numeroPublicadas: number;

  constructor(
    private solicitudesService: SolicitudesService,
    public actionSheetController: ActionSheetController,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController,
    private router: Router,
    private active: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('u_data'));
    this.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.id_persona = this.usuario.id_persona;
    this.seleccionTO = new SolicitudesModel();
    this.obtenerSolcitudesPublicadas();
    this.buscar();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.obtenerSolcitudesPublicadas();
          this.buscar();
        }
      }
    });
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
          this.agregar();
        }
      }, {
        text: 'Publicaciones',
        icon: 'reader-outline',
        handler: () => {
        this.router.navigate(['/tabs/home/solicitudes/admin-solicitudes-publicadas']);
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
    this.seleccionTO.id_proveedor = this.usuario.proveedor.id_proveedor;
    this.seleccionTO.id_persona = this.usuario.id_persona;
    this.solicitudesService.buscar(this.seleccionTO).subscribe(
      response => {
        this.lstSolicitudes = response.data;
        this.numeroSolicitudes = this.lstSolicitudes.length;
        this.lstSolicitudesBK = response.data;
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
 
  seleccionarSolicitud(solicitud) {
    this.seleccionTO =  JSON.parse(JSON.stringify(solicitud));
    let navigationExtras = JSON.stringify(this.seleccionTO);
    this.router.navigate(['/tabs/home/solicitudes/card-solicitud'], { queryParams: {special: navigationExtras}  });
  }

  agregar() {
    this.seleccionTO = new SolicitudesModel();
    this.seleccionTO.det_domicilio = new DetDomicilioModel();
    let navigationExtras = JSON.stringify(this.seleccionTO);
    this.router.navigate(['/tabs/home/solicitudes/form-solicitud'],{ queryParams: {special: navigationExtras}  });
  }

  abriAdminPublicadas() {
   this.router.navigate(['/tabs/home/solicitudes/admin-solicitudes-publicadas'], { queryParams: {special: true}  });
  }
/*ADMINISTRADOT DE SOLICITUDES*/
public obtenerSolcitudesPublicadas() {
  this.seleccionTO.id_proveedor = this.id_proveedor;
  this.seleccionTO.id_persona = this.id_persona;
  this.solicitudesService.obtenerSolcitudesPublicadas(this.seleccionTO).subscribe(response => {
    this.lstSolicitudesPublicadas = response.data;
    this.numeroPublicadas = this.lstSolicitudesPublicadas.length;
    this.lstSolicitudesPublicadasBK = response.data;
  },
    error => {
           this.notificaciones.error(error);
    });
}
btnBuscar(e) {
  this.filtro = e.target.value;
  this.lstSolicitudesPublicadas = this.lstSolicitudesPublicadasBK;
  this.lstSolicitudesPublicadas = this.lstSolicitudesPublicadas.filter(element => {
    return element.solicitud.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1
      || element.descripcion.toLowerCase().indexOf(this.filtro.toString().toLowerCase()) > -1;
  });
}
selecAdminPublicada(solicitud: any) {
  this.solicitud = JSON.parse(JSON.stringify(solicitud));
  let navigationExtras = JSON.stringify(this.solicitud);
  this.router.navigate(['/tabs/home/solicitudes/admin-solicitudes-publicadas/card-admin-solicitud'], { queryParams: { special: navigationExtras } });
}
}
