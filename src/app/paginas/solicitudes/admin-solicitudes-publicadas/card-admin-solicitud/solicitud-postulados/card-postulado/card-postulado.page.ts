import { Component, OnInit } from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { Router, ActivatedRoute } from '@angular/router';
import { SolicitudesService } from '../../../../../../api/solicitudes.service';
import { PostuladosModel } from 'src/app/Modelos/PostuladosModel';
import { LoadingController } from '@ionic/angular';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { ToadNotificacionService } from '../../../../../../api/toad-notificacion.service';


@Component({
  selector: 'app-card-postulado',
  templateUrl: './card-postulado.page.html',
  styleUrls: ['./card-postulado.page.scss'],
})
export class CardPostuladoPage implements OnInit {
  public solicitudPostulado: PostuladosModel;
  public lstPostulados: Array<PostuladosModel>;
  public loader: any;
  public extencion: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private solicitudesService: SolicitudesService,
    public loadingController: LoadingController,
    private downloader: Downloader,
    public notificaciones: ToadNotificacionService
  ) {}

  ngOnInit() {
    this.lstPostulados = new Array<PostuladosModel>();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.solicitudPostulado = JSON.parse(params.special);
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
  public checkSolicitud(postulado: PostuladosModel) {
    this.presentLoading();
    this.solicitudesService.checkendPostulacion(postulado).subscribe(
      response => {
        if (response.code === 200) {
          this.lstPostulados = response.data;
          this.loader.dismiss();
        }
        this.loader.dismiss();
      },
      error => {
        this.loader.dismiss();
      }
    );
  }
  cerrar() {
    this.router.navigate(['/tabs/home/solicitudes']);
  }
  descargarArchivo() {
    this.extensionArchivo();
    var request: DownloadRequest = {
      uri: this.solicitudPostulado.url_archivo,
      title: 'Archivo_Solicitud_Postulado',
      description: 'Archivo que contiene una solicitud de un postulado',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: 'Downloads',
        subPath: 'MyFile.' + this.extencion
      }
    };

    this.downloader.download(request)
      .then((location: string) => this.notificaciones.exito('Archivo descargado en:' + location))
      .catch((error: any) => this.notificaciones.error(error));
  }

  extensionArchivo() {
    let listapabra = [];
    for (let i = this.solicitudPostulado.url_archivo.length - 1; i >= 0; i--) {
      if (this.solicitudPostulado.url_archivo[i] === '.') {
        break;
      }else{
        listapabra.push(this.solicitudPostulado.url_archivo[i]);
      }
      this.extencion = listapabra.reverse().toString();
      this.extencion  = this.extencion .split(',').join('');
    }
  }
}
