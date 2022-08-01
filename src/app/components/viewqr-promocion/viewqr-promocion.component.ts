
import {ModalController} from '@ionic/angular';
import { ToadNotificacionService } from '../../api/toad-notificacion.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ICupon } from 'src/app/interfaces/icupon';

import { Plugins, FilesystemDirectory } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
import  QRCode from 'easyqrcodejs';
import html2canvas from 'html2canvas';
import { Auth0Service } from 'src/app/api/auth0.service';


const { Filesystem } = Plugins;
const { Share } = Plugins;

@Component({
  selector: 'app-viewqr-promocion',
  templateUrl: './viewqr-promocion.component.html',
  styleUrls: ['./viewqr-promocion.component.scss'],
  providers: [ Auth0Service]
})
export class ViewqrPromocionComponent implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  @Input() promocion: any;
  @Input() idPersona: number | null;
  @Input() id_cupon_promocion: number | null;
  public qr: any;
  public qrdata: string;
  public urlData: string;
  public capturedImage;
  usuario: any;
  constructor(
    public modalController: ModalController,
    public platform: Platform,
    private notifi: ToadNotificacionService,
    private auth0: Auth0Service,
    public file: File
  ) 
  { 
    this.usuario = this.auth0.getUserData();
  }

  ngAfterViewInit(): void {

    const cupon: ICupon = {
      "idPromo": this.promocion.id_promocion,
      "idPer": this.idPersona,
      "idCupon": this.id_cupon_promocion
    };
    this.urlData =btoa(JSON.stringify(cupon)) ;
    
    const options = {

      text: this.urlData,
      colorLight: '#ffffff',
      colorDark: '#000000',
      dotScale: 0.8,
      width: screen.width,
      height: screen.height-500,
      correctLevel: QRCode.CorrectLevel.H,
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
      this.crearImagen(this.promocion);
    }
  }
  crearImagen(promocion) {
    html2canvas(document.querySelector("#contenido")).then(canvas => {

      this.capturedImage = canvas.toDataURL();
      const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10, 1000) + promocion.nombre_comercial + '.png';
      Filesystem.writeFile({
        path: fileName,
        data: canvas.toDataURL().toString(),
        directory: FilesystemDirectory.Documents
      }).then(() => {
        this.notifi.exito('Se descargo correctamente cupón de ' + promocion.nombre_comercial);
      }, error => {
        this.notifi.error(error);
      });

    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }

}
