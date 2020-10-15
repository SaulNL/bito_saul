import { Component, OnInit } from "@angular/core";
import { FiltroCatVariableModel } from "../../../../Modelos/catalogos/FiltroCatVariableModel";
import { AdministracionService } from "../../../../api/administracion-service.service";
import { constants } from "buffer";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-cat-variable",
  templateUrl: "./cat-variable.page.html",
  styleUrls: ["./cat-variable.page.scss"],
})
export class CatVariablePage implements OnInit {
  public selectTO: FiltroCatVariableModel;
  public lstCatVariable: Array<any>;
  public filtro: FiltroCatVariableModel;
  public blnActivaDatosVariable: boolean;
  public isToggled: boolean;
  public loader : boolean;

  constructor(
    private servicioUsuarios: AdministracionService,
    public loadingController: LoadingController
  ) {
    this.loader = false;
    this.isToggled = false;
    this.blnActivaDatosVariable = false;
    this.lstCatVariable = [];
    this.filtro = new FiltroCatVariableModel();
  }
  public notify() {
    if (this.isToggled === false) {
      this.getVariables();
    }
    this.filtro = new FiltroCatVariableModel();
  }
  ngOnInit() {
    this.getVariables();
  }
  datosVariables(variable: FiltroCatVariableModel) {
    this.selectTO =  JSON.parse(JSON.stringify(variable));
    this.blnActivaDatosVariable = true;
  }
  agregarVariable() {
    this.selectTO = new FiltroCatVariableModel();
    this.blnActivaDatosVariable = true;
  }
  getVariables() {
    this.servicioUsuarios.listarVariables().subscribe(
      (response) => {
        this.lstCatVariable = response.data;
      },
      (error) => {
        
      }
    );
  }
  logForm(form) {
    this.obtenerVariables(form.value);
}
  public obtenerVariables(form) {
    this.servicioUsuarios.obtenerVariable(form).subscribe(
      response => {
        //this.load = false;
        this.lstCatVariable = response.data;
        //this.blnMensajeFiltro = true;
      },
      error => {
        //this._notificacionService.pushError(error);
      }
    );
      //if (this.validarFiltros()) {
        //this.load = true;
        
      //} else {
        //this._notificacionService.pushAlert('Seleccione un parametro de búsqueda');
      //}
    }
}
