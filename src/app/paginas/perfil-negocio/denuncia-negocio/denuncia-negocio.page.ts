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
  public denunciaTO: DenunciaModel;
  public user: any;
  public preguntaUno: any;
  public loader: any;
  constructor(
    private modalController: ModalController,
    private _serviceAdministracion: AdministracionService,
    private notificaciones: ToadNotificacionService,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('u_data'));
    this.denunciaTO = new DenunciaModel();
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  guardarDenuncia() {
    if (this.user.id_persona !== undefined) {
      this.denunciaTO.preguntas = Array<PreguntaModel>();
      this.denunciaTO.id_persona = this.user.id_persona;
      this.denunciaTO.id_negocio = this.idNegocio;
      this.denunciaTO.preguntas.push(new PreguntaModel(1, 'El negocio no existe', document.getElementById('pregunta1').checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(2, 'Se hace pasar por alguien más', document.getElementById('pregunta2').checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(3, 'Perfil sin contenido', document.getElementById('pregunta3').checked));
      // tslint:disable-next-line: max-line-length
      this.denunciaTO.preguntas.push(new PreguntaModel(4, 'Su oferta es distinta a lo que anuncia', document.getElementById('pregunta4').checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(5, 'No respeta sus promociones', document.getElementById('pregunta5').checked));
      this.denunciaTO.preguntas.push(new PreguntaModel(6, 'comentario', document.getElementById('pregunta6').value));
      if (document.getElementById('pregunta1').checked === true ||
        document.getElementById('pregunta2').checked === true ||
        document.getElementById('pregunta3').checked === true ||
        document.getElementById('pregunta4').checked === true ||
        document.getElementById('pregunta5').checked === true ||
        document.getElementById('pregunta6').value !== '') {
          this.presentLoading();
        this._serviceAdministracion.guardarDenunciaNegocio(this.denunciaTO).subscribe(
       data => {
         if (data.code === 200) {
           this.loader.dismiss();
           this.notificaciones.exito('se guardo correctamente la denuncia');
           this.cerrarModal();
         } else {
           this.loader.dismiss();
           this.notificaciones.error(data.message);
         }
       },
       error => {
         this.notificaciones.error(error);
         this.loader.dismiss();
       }
     );
      } else {
        this.notificaciones.alerta('Para poder denunciar este negocio, necesitas seleccionar una pregunta ó realizar un comentario');
      }
    } else {
      this.notificaciones.alerta('Para poder denunciar este negocio, necesitas ser usuario logeado');
    }
  }
}
