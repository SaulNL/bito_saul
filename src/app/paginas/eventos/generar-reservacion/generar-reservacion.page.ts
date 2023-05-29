import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {EventosService} from '../../../api/eventos.service';
import {IEventoQr} from '../../../interfaces/IEventoQr';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';

@Component({
  selector: 'app-generar-reservacion',
  templateUrl: './generar-reservacion.page.html',
  styleUrls: ['./generar-reservacion.page.scss'],
})
export class GenerarReservacionPage implements OnInit {
  @ViewChild('qrCode', { static: false }) qrCodeElement: ElementRef;
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
    const evento: IEventoQr = {
      id_evento: this.cadena[0],
      id_persona: this.cadena[1],
      fc_evento_reservacion: this.cadena[2],
      cantidad_persona: this.cadena[3]
    };
    this.qrData = JSON.stringify(evento);
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
          console.log(this.infoEvento, 'informacion23');
        });
  }

  descargar() {

  }

  numeroAleatorioDecimales(min, max) {
    var num = Math.random() * (max - min);
    return num + min;
  }
}
