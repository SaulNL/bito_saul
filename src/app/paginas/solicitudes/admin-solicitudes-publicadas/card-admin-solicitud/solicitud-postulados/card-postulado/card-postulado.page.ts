import { Component, OnInit } from '@angular/core';
import { SolicitudesModel } from 'src/app/Modelos/SolicitudesModel';
import { Router, ActivatedRoute } from '@angular/router';
import { SolicitudesService } from '../../../../../../api/solicitudes.service';
import { PostuladosModel } from 'src/app/Modelos/PostuladosModel';
import { LoadingController } from '@ionic/angular';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { ToadNotificacionService } from '../../../../../../api/toad-notificacion.service';
import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';


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
    public notificaciones: ToadNotificacionService,
    private http: HTTP,
    private file: File
  ) { }

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
    this.presentLoading();
    setTimeout(() => {
      var request: DownloadRequest = {
        uri: this.solicitudPostulado.url_archivo,
        title: 'Archivo_Solicitud_Postulado',
        description: 'Archivo que contiene una solicitud de un postulado',
        mimeType: '',
        visibleInDownloadsUi: true,
        notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
        destinationInExternalFilesDir: {
          dirType: '',
          subPath: '../../../../Download/'+this.solicitudPostulado.nombre+'_Archivo_Postulado.' + this.extencion
        }
      };
      this.downloader.download(request)
        .then(
          () => this.notificaciones.exito('El Archivo se descargo con exito'),this.loader.dismiss())
        .catch((error) => this.notificaciones.error(error));
    }, 700);
  }

  extensionArchivo() {
    let listapabra = [];
    for (let i = this.solicitudPostulado.url_archivo.length - 1; i >= 0; i--) {
      if (this.solicitudPostulado.url_archivo[i] === '.') {
        break;
      } else {
        listapabra.push(this.solicitudPostulado.url_archivo[i]);
      }
    }
    this.extencion = listapabra.reverse().toString();
    this.extencion = this.extencion.split(',').join('');
  }
  descargaHttp(){
    this.extensionArchivo();
    setTimeout(() => {
      const options: any = {
        method: 'get',
        responseType: 'blob',
        headers: {
        accept: this.getMimetype(this.extencion),
        }
      };
     this.http.sendRequest(this.solicitudPostulado.url_archivo,options).then((response)=>{
        let blob: Blob = response.data;
        let blob1 = response.data.slice(0, response.data.size, "image/jpg")
        console.log('blob1');
        console.log(blob1);
        console.log('response.data');
        console.log(response.data);
        this.file.writeFile(this.file.externalDataDirectory, this.solicitudPostulado.nombre+'_Archivo_Postulado.' + this.extencion, blob1, { replace: true, append: false}).then((response)=>{
          this.notificaciones.exito('se guardo correctamente el archivo');
        }).catch((error) => this.notificaciones.error(error));
      }) .catch((error) => this.notificaciones.error(error));
       }, 700);
      }
    getMimetype(name){
    if(name.indexOf('pdf') >= 0){
      console.log('este archivo es pdf');
      return 'application/pdf';
    }else if(name.indexOf('png') >= 0){
      console.log('este archivo es png');
      return 'image/png';
    }else if(name.indexOf('jpeg') >= 0){
      console.log('este archivo es jpeg');
      return 'image/jpeg';
    }else if(name.indexOf('jpg') >= 0){
      console.log('este archivo es jpg');
      return 'image/jpg';
    }
    }
}
