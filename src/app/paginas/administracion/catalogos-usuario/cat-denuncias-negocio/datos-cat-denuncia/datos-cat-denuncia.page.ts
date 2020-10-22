import { Component, OnInit, Input } from '@angular/core';
import { CatDenunciasNegocioPage } from '../cat-denuncias-negocio.page';
import { DenunciaModel } from '../../../../../Modelos/DenunciaModel';
import { AdministracionService } from '../../../../../api/administracion-service.service';
import { ToadNotificacionService } from "../../../../../api/toad-notificacion.service";

@Component({
  selector: 'app-datos-cat-denuncia',
  templateUrl: './datos-cat-denuncia.page.html',
  styleUrls: ['./datos-cat-denuncia.page.scss'],
})
export class DatosCatDenunciaPage implements OnInit {
  @Input() public actualTO: DenunciaModel;
  public variableTO: DenunciaModel;
  constructor(
    private admin: CatDenunciasNegocioPage 
  ) { 
    this.variableTO = new DenunciaModel();
  }

  ngOnInit() {
    this.variableTO = this.actualTO;
    console.log(this.variableTO);
  }
  regresar() {
    this.admin.blnActivaComentarios = false;
  }
}
