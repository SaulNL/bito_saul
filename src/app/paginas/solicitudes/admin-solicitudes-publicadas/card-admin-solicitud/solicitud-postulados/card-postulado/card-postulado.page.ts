import { Component, OnInit } from "@angular/core";
import { SolicitudesModel } from "src/app/Modelos/SolicitudesModel";
import { Router, ActivatedRoute } from "@angular/router";
import { SolicitudesService } from "../../../../../../api/solicitudes.service";
import { PostuladosModel } from "src/app/Modelos/PostuladosModel";
import { LoadingController } from "@ionic/angular";
import { Downloader, DownloadRequest, NotificationVisibility } from "@ionic-native/downloader/ngx";
import { ToadNotificacionService } from "../../../../../../api/toad-notificacion.service";
import { Platform } from '@ionic/angular';
import { HTTP } from "@ionic-native/http/ngx";
import { File } from "@ionic-native/file/ngx";
import { Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

@Component({
  selector: "app-card-postulado",
  templateUrl: "./card-postulado.page.html",
  styleUrls: ["./card-postulado.page.scss"],
})
export class CardPostuladoPage implements OnInit {
  public solicitudPostulado: PostuladosModel;
  public lstPostulados: Array<PostuladosModel>;
  public loader: any;
  public extencion: string;
  public message: string;
  public ckecket: boolean;
  public isIOS: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private solicitudesService: SolicitudesService,
    public loadingController: LoadingController,
    private downloader: Downloader,
    public notificaciones: ToadNotificacionService,
    private http: HTTP,
    private file: File,
    public platform: Platform
  ) {
    this.loader = false
    this.message = 'Cargando...';
    this.isIOS = this.platform.is('ios');
  }

  ngOnInit() {
    if (localStorage.getItem("isRedirected") === "false" && !this.isIOS) {
      localStorage.setItem("isRedirected", "true");
      //location.reload();
      // window.location.assign(this.router.url);
    }
    this.lstPostulados = new Array<PostuladosModel>();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.special) {
        this.solicitudPostulado = JSON.parse(params.special);
        this.ckecket = (this.solicitudPostulado.checkend === 1) ? true : false;
      }
    });
  }

  public checkSolicitud(postulado: PostuladosModel) {
    this.solicitudesService.checkendPostulacion(postulado).subscribe(
      (response) => {
        if (response.code === 200) {
          this.lstPostulados = response.data;
        }
      }
    );
  }
  cerrar() {
    this.loader = false;
    let navigationExtras = JSON.stringify(this.solicitudPostulado);
    //this.router.navigate(["/tabs/home/solicitudes/admin-solicitudes-publicadas/card-admin-solicitud/solicitud-postulados"], { queryParams: { special: navigationExtras } });
    this.router.navigate(["/tabs/home/solicitudes/admin-solicitudes-publicadas/card-admin-solicitud/solicitud-postulados"]);
  }
  descargarAndroid() {
    // this.extensionArchivo();
    this.message = 'Descargando archivo....';
    this.loader = true;
    var request: DownloadRequest = {
      uri: this.solicitudPostulado.url_archivo,
      title: this.solicitudPostulado.nombre + "_Archivo_Postulado." + this.extencion,
      description: "Archivo que contiene una solicitud de un postulado",
      mimeType: "",
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: "",
        subPath: Directory.Documents + "/" + this.solicitudPostulado.nombre + "_Archivo_Postulado." + this.extencion
      }
    };
    this.downloader.download(request).then((location: string) => {
      this.notificaciones.exito("El Archivo se descargo con exito")
      this.loader = false;
    }).catch((error: any) => {
      this.loader = false;
      this.notificaciones.error(error)
    });
  }

  extensionArchivo() {
    let listapabra = [];
    for (let i = this.solicitudPostulado.url_archivo.length - 1; i >= 0; i--) {
      if (this.solicitudPostulado.url_archivo[i] === ".") {
        break;
      } else {
        listapabra.push(this.solicitudPostulado.url_archivo[i]);
      }
    }
    this.extencion = listapabra.reverse().toString();
    this.extencion = this.extencion.split(",").join("");
    if (this.platform.is('ios')) {
      this.descargarIOS();
    } else {
      this.descargarAndroid();
    }
  }
  descargarIOS() {
    // this.extensionArchivo();
    this.loader = true;
    setTimeout(() => {
      const options: any = {
        method: "get",
        responseType: "blob",
        headers: {
          accept: this.getMimetype(this.extencion),
        },
      };
      this.http.sendRequest(this.solicitudPostulado.url_archivo, options)
        .then((response) => {
          let blob: Blob = response.data;
          this.file
            .writeFile(
              this.file.documentsDirectory,
              this.solicitudPostulado.nombre + "_Archivo_Postulado." + this.extencion, blob, { replace: true, append: false })
            .then((response) => {
              Share.share({
                title: this.solicitudPostulado.nombre + "_Archivo_Postulado",
                url: response.nativeURL,
              }).then((resShare) => {

              });
            })
            .catch((error) => this.notificaciones.error(error));
        })
        .catch((error) => this.notificaciones.error(error));
      this.loader = false;
    }, 700);
  }
  getMimetype(name) {
    if (name.indexOf("pdf") >= 0) {

      return "application/pdf";
    } else if (name.indexOf("png") >= 0) {

      return "image/png";
    } else if (name.indexOf("jpeg") >= 0) {

      return "image/jpeg";
    } else if (name.indexOf("jpg") >= 0) {

      return "image/jpg";
    }
  }
  descargar() {
    this.extensionArchivo()
  }
}
