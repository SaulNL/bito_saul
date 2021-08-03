import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { AppSettings} from "../../../AppSettings";
import { Platform } from '@ionic/angular';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
const { Filesystem } = Plugins;
const { Share } = Plugins;
@Component({
  selector: 'app-view-qr',
  templateUrl: './view-qr.page.html',
  styleUrls: ['./view-qr.page.scss'],
})
export class ViewQrPage implements OnInit {
  public negocioTO: NegocioModel;
  public qrdata: string = null;
  public elementType: "img" | "url" | "canvas" | "svg" = null;
  public level: "L" | "M" | "Q" | "H";
  public scale: number;
  public width: number;
  public colorLight: any;
  public colorDark: any;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private notif: ToadNotificacionService,
    public platform: Platform,
    private notifi: ToadNotificacionService,
    public file: File
  ) {
    this.elementType = "img";
    this.level = "H";
    this.scale = 0.4;
    this.width = 512;
    this.colorLight = '#ffffff';
    this.colorDark = '#f100db';
   }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO  = JSON.parse(params.special);
        if (this.negocioTO.url_negocio == null || this.negocioTO.url_negocio == undefined){
          this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
        } else{
          this.qrdata = AppSettings.URL_FRONT+this.negocioTO.url_negocio+'qr';
        }

      }
    });
  }
  regresar() {
    this.router.navigate(['/tabs/home/negocio'], { queryParams: {special: true}  });
    this.qrdata = '';
  }
  descargarAndroid(negocio) {
    let base64Imagen = document.querySelectorAll('.qrcode img')[0] as any;
    let base64Ima = base64Imagen.getAttribute("src");
    const fileName = 'qr_'+negocio.nombre_comercial+'.png';
    Filesystem.writeFile({
      path: fileName,
      data: base64Ima,
      directory: FilesystemDirectory.Documents
  }).then(() => {
    this.notifi.exito('Se descargo correctamente qr de '+negocio.nombre_comercial);
  }, error => {
    this.notifi.error(error);
  });
  }
    convertBase64ToBlob() {
        // Split into two parts
        let base64Imagen = document.querySelectorAll('.qrcode img')[0] as any;
        let base64Ima = base64Imagen.getAttribute("src");
        const parts = base64Ima.split(';base64,');

        // Hold the content type
        const imageType = parts[0].split(':')[1];

        // Decode Base64 string
        const decodedData = window.atob(parts[1]);

        // Create UNIT8ARRAY of size same as row data length
        const uInt8Array = new Uint8Array(decodedData.length);

        // Insert all character code into uInt8Array
        for (let i = 0; i < decodedData.length; ++i) {
          uInt8Array[i] = decodedData.charCodeAt(i);
        }

        // Return BLOB image after conversion
        return new Blob([uInt8Array], { type: imageType });
      }
      descargarIOS(negocio){
        const fileName = 'qr_'+negocio.nombre_comercial+'.png';
        const DataBlob = this.convertBase64ToBlob();
       this.file.writeFile(this.file.tempDirectory, fileName, DataBlob, { replace: true }).then(res => {
          Share.share({
              title: fileName,
              url: res.nativeURL,
          }).then(resShare => {

          });
      }, err => {

      });
      }
  descargar(){
   if(this.platform.is('ios')){

      this.descargarIOS(this.negocioTO);
    }else{
      
      this.descargarAndroid( this.negocioTO);
    }
  }
}
