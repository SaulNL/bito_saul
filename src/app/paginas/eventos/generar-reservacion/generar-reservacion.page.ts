import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EventosService} from '../../../api/eventos.service';
import easyQRCode from 'easyqrcodejs';
import {IEventoQr} from '../../../interfaces/IEventoQr';
import html2canvas from 'html2canvas';
import {FilesystemDirectory, Plugins} from '@capacitor/core';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';
const { Filesystem } = Plugins;

@Component({
  selector: 'app-generar-reservacion',
  templateUrl: './generar-reservacion.page.html',
  styleUrls: ['./generar-reservacion.page.scss'],
})
export class GenerarReservacionPage implements OnInit {
  @ViewChild('qrcode') qrcode: ElementRef;
  public cadena: any;
  public infoEvento: any;
  public qr: any;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  usuario: any;
  loaderCupon = false;
  registro1 = false;
  registro2 = false;
  registro3 = false;
  public urlData: string;


  constructor(
      private eventosService: EventosService,
      private router: Router,
      private notifi: ToadNotificacionService,
  ) {
      this.infoEvento = [];
      this.loaderReservaciones = false;
  }

  ngOnInit() {
    this.cadena = history.state.cadena;
    const idDetalle = this.cadena[0];
    this.obtenerInfoEvento(idDetalle);
    const datosUsuario = JSON.parse(localStorage.getItem('u_data'));
    this.usuario = `${datosUsuario.nombre} ${datosUsuario.paterno} ${datosUsuario.materno}`;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    console.log('qr1', this.qrcode);
    const options = {
      text: 'Texto del código QR',
      width: 200,
      height: 200,
      correctLevel: easyQRCode.CorrectLevel.H,
    };

    this.qr = new easyQRCode(this.qrcode.nativeElement, options);
  }

  regresar(){
    this.router.navigate(['/tabs/eventos'], {
      queryParams: {
        special: true
      }
    });
  }


  obtenerInfoEvento(id: string): void {
    const idDetalle = id;
    this.eventosService.eventoDetalle(idDetalle).subscribe(
        res => {
          this.infoEvento = res.data;
          this.loaderReservaciones = true;
          console.log(this.infoEvento, 'informacion23');
        });
  }

  descargar() {
    this.loaderCupon = true;
    setTimeout(() => {
      if (this.registro1 || this.registro2){
        this.crearImagen(this.infoEvento);
      }
      if (this.registro3){
        this.loaderCupon = false;
        this.notifi.error('Este evento no es valido para usted');
      }
    }, 200);
  }

  crearImagen(cadena) {
    html2canvas(document.querySelector('#contenido')).then(canvas => {


      const fileName = 'qr_promo' + this.numeroAleatorioDecimales(10, 1000) + cadena.evento + '.png';
      Filesystem.writeFile({
        path: fileName,
        data: canvas.toDataURL().toString(),
        directory: FilesystemDirectory.Documents
      }).then(() => {
        this.notifi.exito('Se descargo correctamente cupón de ' + cadena.evento);
      }, error => {
        this.notifi.error(error);
      });
      this.loaderCupon = false;
    });
  }

  numeroAleatorioDecimales(min, max) {
    let num = Math.random() * (max - min);
    return num + min;
  }

}
