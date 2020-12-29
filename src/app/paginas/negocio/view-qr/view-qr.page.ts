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
          this.qrdata = AppSettings.URL_FRONT+this.negocioTO.url_negocio;
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
  b64toBlob(contentType, sliceSize?):any{
    let base64Imagen = document.querySelectorAll('.qrcode img')[0] as any;
    let base64Ima = base64Imagen.getAttribute("src");
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
   const byteCharacters = atob(base64Ima);
   const byteArrays = [];
   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
             byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
        }
      }
      descargarIOS(negocio){
        const fileName = 'qr_'+negocio.nombre_comercial+'.png';
        const DataBlob = this.b64toBlob('image/png');
        console.log('DataBlob');
        console.log(DataBlob);
        this.file.writeFile(this.file.tempDirectory, fileName, DataBlob, { replace: true }).then(res => {
          console.log('responseWriteFile => ', res); 
          Share.share({
              title: fileName,
              url: res.nativeURL,
          }).then(resShare => {
              console.log(resShare);
          });
      }, err => {
          console.log('Error dataDirectory: ', err);
      });
      }
  descargar(){
    if(this.platform.is('ios')){
      console.log('este dispositivo es IOS');
      this.descargarIOS(this.negocioTO);
    }else{
      console.log('este dispositivo es ANDROID');
      this.descargarAndroid( this.negocioTO);
    }
  }
}
