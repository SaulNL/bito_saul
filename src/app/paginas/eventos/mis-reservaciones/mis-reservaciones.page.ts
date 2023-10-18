import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsCls} from '../../../utils/UtilsCls';
import {EventosService} from '../../../api/eventos.service';
import {Router} from '@angular/router';
import {AlertController, IonContent, ModalController} from '@ionic/angular';
import {DetallesReservaComponent} from "../detalles-reserva/detalles-reserva.component";

@Component({
  selector: 'app-mis-reservaciones',
  templateUrl: './mis-reservaciones.page.html',
  styleUrls: ['./mis-reservaciones.page.scss'],
})
export class MisReservacionesPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public cordenada: number;
  public dias: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public idPersona: number | null;
  public existeSesion: boolean;
  public reservacionesAll: any;
  public numDia: any;
  public numeroDia: number;
  public numeroMes: number;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  openReservacion: number;

  constructor(
      private eventosService: EventosService,
      private utils: UtilsCls,
      private router: Router,
      public alertController: AlertController,
      public modalController: ModalController
  ) {
    this.reservacionesAll = [];
    this.idPersona = null;
    this.existeSesion = utils.existe_sesion();
    this.loaderReservaciones = false;
  }

  ngOnInit() {
    this.idPersona = (this.utils.existSession()) ? this.utils.getIdUsuario() : null;
    this.mostrarMisReservaciones();
    this.openReservacion = JSON.parse(localStorage.getItem('openReser'));
    if ( this.openReservacion == null){
      this.openReservacion = 1;
    }
    localStorage.removeItem('openReser');
  }

  regresar(){
    this.router.navigate(['/tabs/eventos'], {
      queryParams: {
        special: true
      }
    });
  }

  mostrarMisReservaciones(): void{
    this.eventosService.mostrarReservaciones(this.idPersona).subscribe(
        res => {
          this.reservacionesAll = res.data;
          this.reservacionesAll.sort((a, b) => {
            const fechaA = a.fc_evento_reservacion ? new Date(a.fc_evento_reservacion) : null;
            const fechaB = b.fc_evento_reservacion ? new Date(b.fc_evento_reservacion) : null;
            if (!fechaA && !fechaB) {
              return 0;
            } else if (!fechaA) {
              return 1;
            } else if (!fechaB) {
              return -1;
            }
            return fechaB.getTime() - fechaA.getTime();
          });
          this.loaderReservaciones = true;
        });
  }


  async datosEventos(obj: any): Promise<void> {
    this.eventosService.setSelectedObj(obj);
    const modal = await this.modalController.create({
      component: DetallesReservaComponent
    });
    await modal.present();
  }

  convertirFecha(fecha: string): string{
    const fechaObjeto = new Date(fecha);
    this.numDia = fechaObjeto.getDay();
    this.numeroDia = fechaObjeto.getDate();
    this.numeroMes = fechaObjeto.getMonth();
    const diaEscrito = this.dias[this.numDia];
    const diaNumero = this.numeroDia;
    const mesEscrito = this.meses[this.numeroMes];

    return `${diaEscrito} ${diaNumero} de ${mesEscrito}`;
  }

  async mensajeRegistro() {
    const alert = await this.alertController.create({
      header: 'Bituyú',
      message: "¿Ya tienes una cuenta?",
      buttons: [
        {
          text: "Iniciar sesión",
          cssClass: 'text-grey',
          handler: () => {
            this.router.navigate(['/tabs/login']);
          }
        },
        {
          text: "Registrate",
          cssClass: 'text-rosa',
          handler: () => {
            this.router.navigate(["/tabs/login/sign-up"]);
          },
        },
      ],
    });
    await alert.present();
  }

  regresarAjustes() {
    this.router.navigate(['/tabs/home']);
  }
}
