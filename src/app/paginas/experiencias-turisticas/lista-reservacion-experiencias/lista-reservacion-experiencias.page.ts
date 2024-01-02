import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {ExperienciasTuristicasService} from "../../../api/experienciasTuristicas/experiencias-turisticas.service";
import {UtilsCls} from "../../../utils/UtilsCls";
import {IonContent, ModalController} from '@ionic/angular';
import {DetallesReservacionExComponent} from "../detalles-reservacion-ex/detalles-reservacion-ex.component";

@Component({
  selector: 'app-lista-reservacion-experiencias',
  templateUrl: './lista-reservacion-experiencias.page.html',
  styleUrls: ['./lista-reservacion-experiencias.page.scss'],
})
export class ListaReservacionExperienciasPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public dias: string[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
  public meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public reservacionesAll: any;
  public idPersona: number | null;
  public existeSesion: boolean;
  public loaderReservaciones: boolean;
  public msj = 'Cargando';
  public cordenada: number;
  constructor(
      private router: Router,
      private experienciasService: ExperienciasTuristicasService,
      private utils: UtilsCls,
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
  }

  regresar(){
    this.router.navigate(['/tabs/experiencias-turisticas']);
  }

  mostrarMisReservaciones(): void{
    this.experienciasService.reservacionesUsuario(this.idPersona).subscribe(
        res => {
          this.loaderReservaciones = true;
          this.reservacionesAll = res.data;
        });
  }

  convertirFecha(fecha: string): string{
    const fechaObjeto = new Date(fecha);
    const numDia = fechaObjeto.getDay();
    const numeroDia = fechaObjeto.getDate();
    const numeroMes = fechaObjeto.getMonth();
    const diaEscrito = this.dias[numDia];
    const mesEscrito = this.meses[numeroMes];

    return `${diaEscrito} ${numeroDia} de ${mesEscrito}`;
  }

  async datosExperiencia(dato: any){
    this.experienciasService.setSelectedObj(dato);
    const modal = await this.modalController.create({
      component: DetallesReservacionExComponent
    });
    await modal.present();
  }
}
