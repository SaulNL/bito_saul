import { CambioUrlModel } from './../../Modelos/CambioUrlModel';
import { ToadNotificacionService } from './../../api/toad-notificacion.service';
import { AdministracionService } from './../../api/administracion-service.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-solicitar-cambio-url',
  templateUrl: './solicitar-cambio-url.component.html',
  styleUrls: ['./solicitar-cambio-url.component.scss'],
})
export class SolicitarCambioUrlComponent implements OnInit {
  @Input() public idNegocio: number;
  public cambiarUrlTO: CambioUrlModel;
  public loader: boolean;
  public msj = 'Solicitando Cambio';
  constructor(
    private modalController: ModalController,
    private _serviceAdministracion: AdministracionService,
    private notificaciones: ToadNotificacionService
  ) {
    this.loader = false;
    this.cambiarUrlTO = new CambioUrlModel();
  }

  ngOnInit() { }

  cerrarModal() {
    this.modalController.dismiss();
  }
  enviarSolicitud() {
    this.loader = true;
    if (
      this.cambiarUrlTO.motivo !== null &&
      this.cambiarUrlTO.motivo !== "" &&
      this.cambiarUrlTO.url !== null &&
      this.cambiarUrlTO.url !== ""
    ) {
      this.cambiarUrlTO.id_negocio = this.idNegocio;

      this._serviceAdministracion
        .enviarCambioUrlCorreo(this.cambiarUrlTO)
        .subscribe(
          (response) => {
            if (response.code === 200) {
              this.cambiarUrlTO = new CambioUrlModel();
            }
            this.cerrarModal();
            this.loader = false;
            this.notificaciones.exito(response.message);
          },
          (error) => {
            this.loader = false;
            this.notificaciones.error(error.message);
          });
    } else {
      this.loader = false;
      this.notificaciones.error("todo los datos son requeridos");
    }
  }
}
