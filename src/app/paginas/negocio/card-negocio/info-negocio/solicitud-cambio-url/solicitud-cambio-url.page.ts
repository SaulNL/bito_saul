import { ToadNotificacionService } from './../../../../../api/toad-notificacion.service';
import { Component, OnInit , Input } from '@angular/core';
import { CambioUrlModel } from 'src/app/Modelos/CambioUrlModel';
import { LoadingController, ModalController } from '@ionic/angular';
import { AdministracionService } from 'src/app/api/administracion-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-solicitud-cambio-url',
  templateUrl: './solicitud-cambio-url.page.html',
  styleUrls: ['./solicitud-cambio-url.page.scss'],
})
export class SolicitudCambioUrlPage implements OnInit {
  public negocio: any;
  public cambiarUrlTO: CambioUrlModel;
  public loader: any;

  constructor(
    private modalController: ModalController,
    private _serviceAdministracion: AdministracionService,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocio = JSON.parse(params.special);
      }
    });
    this.cambiarUrlTO = new CambioUrlModel();
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  cerrarModal() {
    this.router.navigate(['/tabs/home/negocio/card-negocio/info-negocio']);
  }
  enviarSolicitud() {
    this.presentLoading();
    if(this.cambiarUrlTO.motivo  !== null  &&this.cambiarUrlTO.motivo  !== '' &&
      this.cambiarUrlTO.url  !== null  &&this.cambiarUrlTO.url  !== '' ){
       this.cambiarUrlTO.id_negocio = this.negocio.id_negocio;
       console.log(this.negocio);
    this._serviceAdministracion.enviarCambioUrlCorreo(this.cambiarUrlTO).subscribe(
      response => {
        if (response.code === 200) {
          this.cambiarUrlTO = new CambioUrlModel();        
        }
        this.notificaciones.exito(response.message);
      },
      error => {
        this.notificaciones.error(error.message);
      },
      () => {
        this.loader.dismiss();
        this.cerrarModal();
    });
  }else{
    this.notificaciones.error('todo los datos son requeridos');
  }
  }
}
