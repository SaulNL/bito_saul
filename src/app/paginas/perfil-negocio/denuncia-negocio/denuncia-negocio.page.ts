import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AdministracionService } from 'src/app/api/administracion-service.service';
import { DenunciaModel } from 'src/app/Modelos/DenunciaModel';
import { PreguntaModel } from 'src/app/Modelos/PreguntaModel';


@Component({
  selector: 'app-denuncia-negocio',
  templateUrl: './denuncia-negocio.page.html',
  styleUrls: ['./denuncia-negocio.page.scss'],
})
export class DenunciaNegocioPage implements OnInit {
  @Input() public idNegocio: number;
  @Input() public negocioNombre: string;
  public denunciaTO: DenunciaModel;
  public user: any;
  public preguntaUno: any;
  public loader: any;
  public msj = 'Guardando';
  constructor(
    private modalController: ModalController,
    private _serviceAdministracion: AdministracionService,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController
  ) {
    this.loader = false;
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('u_data'));
    this.denunciaTO = new DenunciaModel();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  guardarDenuncia() {

    if (this.user.id_persona !== undefined) {
      this.denunciaTO.preguntas = Array<PreguntaModel>();
      this.denunciaTO.id_persona = this.user.id_persona;
      this.denunciaTO.id_negocio = this.idNegocio;
      let pregunta1 = <HTMLInputElement>document.getElementById('pregunta1');
      let pregunta2 = <HTMLInputElement>document.getElementById('pregunta2');
      let pregunta3 = <HTMLInputElement>document.getElementById('pregunta3');
      let pregunta4 = <HTMLInputElement>document.getElementById('pregunta4');
      let pregunta5 = <HTMLInputElement>document.getElementById('pregunta5');
      let pregunta6 = <any>document.getElementById('pregunta6');

      this.denunciaTO.preguntas.push(new PreguntaModel(1, 'El negocio no existe', pregunta1.checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(2, 'Se hace pasar por alguien más', pregunta2.checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(3, 'Perfil sin contenido', pregunta3.checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(4, 'Su oferta es distinta a lo que anuncia', pregunta4.checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(5, 'No respeta sus promociones', pregunta5.checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(6, 'comentario', pregunta6.value));
      if (
        pregunta1.checked === true ||
        pregunta2.checked === true ||
        pregunta3.checked === true ||
        pregunta4.checked === true ||
        pregunta5.checked === true ||
        pregunta6.value !== '') {
        this.loader = true;
        this._serviceAdministracion.guardarDenunciaNegocio(this.denunciaTO).subscribe(
          data => {
            if (data.code === 200) {
              this.loaderFalse();
              this.notificaciones.exito('Se guardo correctamente la denuncia');
              this.cerrarModal();
            } else {
              this.loader = false;
              this.notificaciones.error(data.message);
            }
          },
          error => {
            this.notificaciones.error(error);
            this.loader = false;
          }
        );
      } else {
        this.loader = false;
        this.notificaciones.alerta('Para poder denunciar este negocio, necesitas seleccionar una pregunta ó realizar un comentario');
      }
    } else {
      this.loader = false;
      this.notificaciones.alerta('Para poder denunciar este negocio, necesitas ser usuario logeado');
    }
  }
  private loaderFalse() {
    this.loader = false;
  }
}
