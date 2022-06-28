
import {ModalController} from '@ionic/angular';

import { ToadNotificacionService } from '../../api/toad-notificacion.service';

import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/app/AppSettings';

import { Platform } from '@ionic/angular';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';

import  QRCode from 'easyqrcodejs';
import { ICupon } from 'src/app/interfaces/icupon';

const { Filesystem } = Plugins;
const { Share } = Plugins;

@Component({
  selector: 'app-viewqr-promocion',
  templateUrl: './viewqr-promocion.component.html',
  styleUrls: ['./viewqr-promocion.component.scss'],
})
export class ViewqrPromocionComponent implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @Input() promocion: any;
  @Input() idPersona: number | null;
  public qr: any;
  qrdata: string;
  urlData: string;
  

  constructor(
    public modalController: ModalController,
    private router: Router,
    private active: ActivatedRoute,
    private notif: ToadNotificacionService,
    public platform: Platform,
    private notifi: ToadNotificacionService,
    public file: File
  ) 
  { }

  ngAfterViewInit(): void {

    const cupon: ICupon = {
      "id_promocion": this.promocion.id_promocion,
      "id_persona": this.idPersona
    };
    this.urlData = JSON.stringify(cupon);
    
    const options = {

      title: 'Cupón de descuento BITOO!',
      titleFont: "normal normal bold 18px Arial", //font. default is "bold 16px Arial"
      titleColor: "#000000", // color. default is "#000"
      titleBackgroundColor: "#ffffff", // background color. default is "#fff"
      titleHeight: 70, // height, including subTitle. default is 0
      titleTop: 25, // draws y coordinates. default is 30

      subTitle: 'www.bitoo.com.mx', // content
      subTitleFont: "normal normal normal 16px Arial", // font. default is "14px Arial"
      subTitleColor: "#000000", // color. default is "4F4F4F"
      subTitleTop: 50, // draws y coordinates. default is 0


      text: this.urlData+"qr-promo",
      //logo: 'assets/images/bitooicon.png',
      colorLight: '#ffffff',
      colorDark: '#000000',
      dotScale: 0.5,
      width: screen.width,
      height: screen.height-500,
      correctLevel: QRCode.CorrectLevel.H,
      //logoBackgroundColor: '#f100db',
      logoBackgroundTransparent: true,
      format: 'PNG',
      compressionLevel: 7,
      quality: 0.75,
    };
    this.qr=new QRCode(this.qrcode.nativeElement, options);

  }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
    this.qrdata = '';
  }

  descargar() {
    if (this.platform.is('ios')) {
      //this.descargarIOS();
    } else {
      this.descargarAndroid(this.promocion);
    }
  }

  descargarAndroid(promocion) {
    let base64Imagen = document.querySelectorAll('#qrcode img')[0] as any;
    console.log("base64Imagen",base64Imagen)
    let base64Ima = base64Imagen.getAttribute("src");
    const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10,1000)+ promocion.promocion + '.png';
    Filesystem.writeFile({
      path: fileName,
      data: base64Ima,
      directory: FilesystemDirectory.Documents
    }).then(() => {
      this.notifi.exito('Se descargo correctamente qr de ' + promocion.promocion);
    }, error => {
      this.notifi.error(error);
    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }

}
