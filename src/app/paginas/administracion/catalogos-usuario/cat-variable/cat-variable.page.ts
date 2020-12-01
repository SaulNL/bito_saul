import { Component, OnInit } from "@angular/core";
import { FiltroCatVariableModel } from "../../../../Modelos/catalogos/FiltroCatVariableModel";
import { AdministracionService } from "../../../../api/administracion-service.service";
import { constants } from "buffer";
import { LoadingController } from "@ionic/angular";
import { ToadNotificacionService } from "../../../../api/toad-notificacion.service";
import { Router, ActivatedRoute } from '@angular/router';

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
  public blnBtnFiltro: boolean;

  constructor(private router: Router,
    private notifi: ToadNotificacionService,
    private servicioUsuarios: AdministracionService,
    public loadingController: LoadingController,
    private active: ActivatedRoute
  ) {
    this.loader = false;
    this.isToggled = false;
    this.blnActivaDatosVariable = false;
    this.lstCatVariable = [];
    this.filtro = new FiltroCatVariableModel();
  }
  public notify() {
    if (this.isToggled) {
      this.isToggled = false;
      this.getVariables();
    } else {
      this.isToggled = true;
}
 

    this.filtro = new FiltroCatVariableModel();
  }
  ngOnInit() {
    this.getVariables();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.getVariables();
        }
      }
    });
  }
  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
  }
  validarFiltros() {
    if ((this.filtro.nombre !== null && this.filtro.nombre !== '') ||
      (this.filtro.variable !== null && this.filtro.variable !== '') ||
      (this.filtro.descripcion !== null && this.filtro.descripcion !== '')
    ) {
      return true;
    } else {
      return false;
    }
  }
  datosVariables(variable: FiltroCatVariableModel) {
    this.selectTO =  JSON.parse(JSON.stringify(variable));
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-variable/datos-cat-variables'], { queryParams: {special: navigationExtras}  });
    //this.blnActivaDatosVariable = true;
  }
  agregarVariable() {
    this.selectTO = new FiltroCatVariableModel();
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-variable/datos-cat-variables'], { queryParams: {special: navigationExtras}  });
    //this.blnActivaDatosVariable = true;
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
        this.notifi.error(error);
      }
    );
      if (this.validarFiltros()) {
        //this.load = true;
        
      } else {
        this.notifi.alerta('Seleccione un parametro de búsqueda');
      }
    }

    limpiarFiltro() {
      this.getVariables();
      this.filtro = new FiltroCatVariableModel();
      this.blnBtnFiltro = this.validarFiltros();
    }
}
