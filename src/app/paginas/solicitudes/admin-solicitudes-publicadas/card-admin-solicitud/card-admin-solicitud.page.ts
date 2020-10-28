import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { AlertController } from '@ionic/angular';
import { SolicitudesService } from '../../../../api/solicitudes.service';
import { ToadNotificacionService } from '../../../../api/toad-notificacion.service';

@Component({
  selector: 'app-card-admin-solicitud',
  templateUrl: './card-admin-solicitud.page.html',
  styleUrls: ['./card-admin-solicitud.page.scss'],
})
export class CardAdminSolicitudPage implements OnInit {
  public seleccionadoAdmin: SolicitudesModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private solicitudesService: SolicitudesService,
    private notificaciones: ToadNotificacionService
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.seleccionadoAdmin = JSON.parse(params.special);
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
}
