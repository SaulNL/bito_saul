import { Component, OnInit } from '@angular/core';
import { MsPersonaModel } from '../../Modelos/MsPersonaModel';
import { GeneralServicesService } from '../../api/general-services.service';
import {UtilsCls} from "../../utils/UtilsCls";
import {CatEstadoModel} from "../../Modelos/catalogos/CatEstadoModel";


@Component({
  selector: 'app-datos-complementarios',
  templateUrl: './datos-complementarios.page.html',
  styleUrls: ['./datos-complementarios.page.scss'],
})
export class DatosComplementariosPage implements OnInit {
  proveedorTO: MsPersonaModel;
  public list_cat_estado: Array<CatEstadoModel>;
  constructor(
    private _general_service: GeneralServicesService,
    private _utils_cls: UtilsCls
  ) { }

  ngOnInit() {
    this.load_cat_estados();
  }
  private load_cat_estados() {
    this._general_service.getEstadosWS().subscribe(
      response => {
        if (this._utils_cls.is_success_response(response.code)) {
          this.list_cat_estado = response.data.list_cat_estado;
          console.log(this.list_cat_estado);
        }
      },
      error => {
       // this._notificacionService.pushError(error);
      }
    );
  }
}
