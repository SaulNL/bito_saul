import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NegocioModel } from "./../../../Modelos/NegocioModel";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { AppSettings} from "../../../AppSettings";
import { Platform } from '@ionic/angular';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';

import  QRCode from 'easyqrcodejs';

const { Filesystem } = Plugins;
const { Share } = Plugins;
@Component({
  selector: 'app-view-qr',
  templateUrl: './view-qr.page.html',
  styleUrls: ['./view-qr.page.scss'],
})
export class ViewQrPage implements OnInit {

  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @Input() public text: string;

  @ViewChild('main') main: ElementRef;

  public dataUrl: any;

  public negocioTO: NegocioModel;
  public qrdata: string = null;
  public elementType: "img" | "url" | "canvas" | "svg" = null;
  public level: "L" | "M" | "Q" | "H";
  public scale: number;
  public width: number;
  public colorLight: any;
  public colorDark: any;
  public qr: any;
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
  ngAfterViewInit(): void {
    const options = {

      title: 'BITOO!',
      titleFont: "normal normal bold 18px Arial", //font. default is "bold 16px Arial"
      titleColor: "#000000", // color. default is "#000"
      titleBackgroundColor: "#ffffff", // background color. default is "#fff"
      titleHeight: 70, // height, including subTitle. default is 0
      titleTop: 25, // draws y coordinates. default is 30

      subTitle: 'www.bitoo.com.mx', // content
      subTitleFont: "normal normal normal 16px Arial", // font. default is "14px Arial"
      subTitleColor: "#000000", // color. default is "4F4F4F"
      subTitleTop: 50, // draws y coordinates. default is 0


      text: AppSettings.URL_FRONT + this.negocioTO.url_negocio + 'qr',
      //logo: 'assets/images/bitooicon.png',
      colorLight: '#ffffff',
      colorDark: '#000000',
      dotScale: 0.4,
      width: screen.width,
      height: screen.height-500,
      correctLevel: QRCode.CorrectLevel.H,
      //logoBackgroundColor: '#f100db',
      logoBackgroundTransparent: true,
      format: 'PNG',
      compressionLevel: 6,
      quality: 0.75,
    };
    this.qr=new QRCode(this.qrcode.nativeElement, options);

  }
  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        this.negocioTO = JSON.parse(params.special);
        if (this.negocioTO.url_negocio == null || this.negocioTO.url_negocio == undefined) {
          this.router.navigate(['/tabs/home/negocio'], {
            queryParams: {
              special: true
            }
          });
        } else {
          this.qrdata = AppSettings.URL_FRONT + this.negocioTO.url_negocio + 'qr';
        }

      }
    });
  }
  regresar() {
    this.router.navigate(['/tabs/home/negocio'], {
      queryParams: {
        special: true
      }
    });
    this.qrdata = '';
  }
  descargarAndroid(negocio) {
    let base64Imagen = document.querySelectorAll('#qrcode img')[0] as any;
    let base64Ima = base64Imagen.getAttribute("src");
    const fileName = 'qr_' + this.numeroAleatorioDecimales(10,1000)+negocio.nombre_comercial + '.png';
    Filesystem.writeFile({
      path: fileName,
      data: base64Ima,
      directory: FilesystemDirectory.Documents
    }).then(() => {
      this.notifi.exito('Se descargo correctamente qr de ' + negocio.nombre_comercial);
    }, error => {
      this.notifi.error(error);
    });
  }
  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }
  convertBase64ToBlob() {
    // Split into two parts
    let base64Imagen = document.querySelectorAll('#qrcode img')[0] as any;
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
    return new Blob([uInt8Array], {
      type: imageType
    });
  }
  descargarIOS(negocio) {
    const fileName = 'qr_' + negocio.nombre_comercial + '.png';
    const DataBlob = this.convertBase64ToBlob();
    this.file.writeFile(this.file.tempDirectory, fileName, DataBlob, {
      replace: true
    }).then(res => {
      Share.share({
        title: fileName,
        url: res.nativeURL,
      }).then(resShare => {

      });
    }, err => {

    });
  }
  descargar() {
    if (this.platform.is('ios')) {
      this.descargarIOS(this.negocioTO);
    } else {
     this.descargarAndroid(this.negocioTO);
    }
  }
}