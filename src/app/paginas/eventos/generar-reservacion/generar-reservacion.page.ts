import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from '../../../api/eventos.service';
import { IEventoQr } from '../../../interfaces/IEventoQr';
import { ToadNotificacionService } from '../../../api/toad-notificacion.service';
import QRCode from 'easyqrcodejs';
import html2canvas from 'html2canvas';
import { FilesystemDirectory, Plugins } from '@capacitor/core';

const { Filesystem } = Plugins;

@Component({
  selector: 'app-generar-reservacion',
  templateUrl: './generar-reservacion.page.html',
  styleUrls: ['./generar-reservacion.page.scss'],
})
export class GenerarReservacionPage implements OnInit {
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public numeroDia: number;
  public numeroMes: number;
  public anio: number;
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
  qrData: string = '';
  public htmlDownload: boolean = false;


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
    const idDetalle = this.cadena.id_evento;
    this.obtenerInfoEvento(idDetalle);
    this.convertirFechaHora();
    const datosUsuario = JSON.parse(localStorage.getItem('u_data'));
    this.usuario = `${datosUsuario.nombre} ${datosUsuario.paterno} ${datosUsuario.materno}`;
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    setTimeout(() => {
      const evento: IEventoQr = {
        id_evento: this.cadena.id_evento,
        id_persona: this.cadena.id_persona,
        fc_evento_reservacion: this.cadena.fc_evento_reservacion,
        cantidad_persona: this.cadena.cantidad_persona,
      };
      this.urlData = btoa(JSON.stringify(evento));

      const options = {

        text: this.urlData,
        colorLight: '#ffffff',
        colorDark: '#000000',
        dotScale: 0.4,
        width: 300,
        height: 300,
        correctLevel: QRCode.CorrectLevel.Q,
        logoBackgroundTransparent: true,
        format: 'PNG',
        compressionLevel: 6,
        quality: 0.75,
      };
      this.qr = new QRCode(this.qrcode.nativeElement, options);
    }, 2000)
  }


  regresar() {
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
      });
  }

  descargar() {
    this.htmlDownload = true;
    this.loaderCupon = true;
    setTimeout(() => {
      this.crearImagen(this.infoEvento);
    }, 200);
  }

  crearImagen(evento) {
    html2canvas(document.querySelector('.contendorR')).then(canvas => {
      const fileName = 'qr_evento' + this.numeroAleatorioDecimales(10, 1000) + evento[0]?.evento + '.png';

      Filesystem.writeFile({
        path: fileName,
        data: canvas.toDataURL().toString(),
        directory: FilesystemDirectory.Documents
      }).then(() => {
        this.notifi.exito('Se descargó correctamente el qr de la reservación.');
        this.htmlDownload = false;
      }, error => {
        this.notifi.error(error);
        this.htmlDownload = false;
      });

      this.loaderCupon = false;
    });
  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }

  convertirFechaHora() {
    const fecha = this.cadena.fc_evento_reservacion;
    const fechaObjeto = new Date(fecha);
    this.numeroDia = fechaObjeto.getDate();
    this.numeroMes = fechaObjeto.getMonth();
    this.anio = fechaObjeto.getFullYear();
  }
}
