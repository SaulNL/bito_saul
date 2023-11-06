import { Component, OnInit } from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import {Router, ActivatedRoute} from '@angular/router';
import { SolicitudesService } from 'src/app/api/solicitudes.service';
import { AlertController } from '@ionic/angular';
import { ToadNotificacionService } from 'src/app/api/toad-notificacion.service';

@Component({
  selector: 'app-card-solicitud',
  templateUrl: './card-solicitud.page.html',
  styleUrls: ['./card-solicitud.page.scss'],
})
export class CardSolicitudPage implements OnInit {
  public solicitud: SolicitudesModel;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private solicitudesService: SolicitudesService,
    public alertController: AlertController,
    private notificaciones: ToadNotificacionService,
  ) {

   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.solicitud = JSON.parse(params.special);
      }
    });
  }

  abrirModal(){
    this.solicitud =  JSON.parse(JSON.stringify(this.solicitud));
    let navigationExtras = JSON.stringify(this.solicitud);
    this.router.navigate(['/tabs/home/solicitudes/card-solicitud/modal-publicar-solicitud'], { queryParams: {special: navigationExtras}  });
  }
  public modificar() {
    this.solicitud =  JSON.parse(JSON.stringify(this.solicitud));
    let navigationExtras = JSON.stringify(this.solicitud);
    this.router.navigate(['/tabs/home/solicitudes/form-solicitud'], { queryParams: {special: navigationExtras}  });
  }

  public isActive(active: any) {
    return (active === 1);
  }
  public messageIsActive(active: any) {
    return (this.isActive(active)) ? 'Publicado' : 'Sin Publicar';
  }

  async quitarPublicacion(solicitud) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Desea dejar de publicar esta solicitud ' +'"'+ solicitud.solicitud+'"?',
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
            this.solicitudesService.quitarPublicacion(solicitud).subscribe(
              response => {
                this.notificaciones.exito('Se despublico correctamente la solicitud');
                this.regresar();
              },
              error => {
                this.notificaciones.error(error);
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  regresar() {
    this.router.navigate(['/tabs/home/solicitudes'], { queryParams: { special: true } });
  }

  
}
