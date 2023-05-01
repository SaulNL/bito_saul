import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { AlertController } from '@ionic/angular';
import { SolicitudesService } from '../../../../api/solicitudes.service';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';
import { ModalQuienVioRequerimientoComponent } from 'src/app/components/modal-quien-vio-requerimiento/modal-quien-vio-requerimiento.component';
import { ModalController } from '@ionic/angular';
import { GeneralServicesService } from 'src/app/api/general-services.service';
@Component({
  selector: 'app-card-admin-solicitud',
  templateUrl: './card-admin-solicitud.page.html',
  styleUrls: ['./card-admin-solicitud.page.scss'],
})
export class CardAdminSolicitudPage implements OnInit {
  public seleccionadoAdmin: SolicitudesModel;
  features18: boolean;
  constructor(
    public modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private solicitudesService: SolicitudesService,
    private notificaciones: ToadNotificacionService,
    private _general_service: GeneralServicesService,
  ) { }

  ngOnInit() {
    this.features18=false
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.seleccionadoAdmin = JSON.parse(params.special);
        //console.log("Solicitud panaaa: "+this.seleccionadoAdmin.id_negocio)
        this.obtenerFeatures(this.seleccionadoAdmin.id_negocio)
      }
    });
  }

  regresar() {
    this.router.navigate(['/tabs/home/solicitudes'], { queryParams: { special: true } });
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Desea dejar de publicar esta solicitud ' +'"'+ this.seleccionadoAdmin.solicitud+'"?',
      message: '!Precaución! esta acción no podrá ser revertida',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          role: 'destructive',
          text: 'Confirmar',
          handler: () => {
           this.quitarPublicacion();
          }
        }
      ]
    });
    await alert.present();
  }
  quitarPublicacion() {
    this.solicitudesService.quitarPublicacion(this.seleccionadoAdmin).subscribe(
      response => {
        this.notificaciones.exito('Se despublico correctamente la solicitud');
        this.regresar();
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
abrirModalPostulados(solicitud: any){
  this.seleccionadoAdmin = JSON.parse(JSON.stringify(solicitud));
  let navigationExtras = JSON.stringify(this.seleccionadoAdmin);
  this.router.navigate(['/tabs/home/solicitudes/admin-solicitudes-publicadas/card-admin-solicitud/solicitud-postulados'] , { queryParams: { special: navigationExtras } });
}
async obtenerFeatures(id_negocio: number){
  await this._general_service.features(id_negocio).subscribe(
      response => {
          //console.log("FEATURES del id_negocio en requerimiento: "+id_negocio+",\n"+JSON.stringify(response))
          this.features18 = false;
          if (response.data.lenght != 0){                    
              response.data.forEach(feature => {
                  if(feature.id_caracteristica == 2){                      
                    this.features18 = true;                    
                  }        
              });
          }else{
            //console.log("Features Vacío")            
          }
      },
      error => {
          console.log("error"+error)
      }
  );
}

  async abrirModalQuienVio(solicitud: any){
    const modal = this.modalController.create({
      component: ModalQuienVioRequerimientoComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        solicitud: solicitud
      }
    });
    (await modal).present();
  }
}
