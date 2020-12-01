import { Component, OnInit } from '@angular/core';
import {FiltroCatRolModel} from '../../../../Modelos/catalogos/FiltroCatRolModel';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { ToadNotificacionService } from "../../../../api/toad-notificacion.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cat-rol',
  templateUrl: './cat-rol.page.html',
  styleUrls: ['./cat-rol.page.scss'],
})
export class CatRolPage implements OnInit {
  public lstCatRol: Array<any>;
  public blnActivaDatosRol: boolean;
  public selectTO: FiltroCatRolModel;
  public isToggled: boolean;
  public blnBtnFiltro: boolean;
  public botonAgregar: boolean;
  constructor(private notificaciones: ToadNotificacionService,
    private servicioUsuarios: AdministracionService,
    private router: Router,
    private active: ActivatedRoute
    
  ) { 
    this.isToggled = false;
    this.blnActivaDatosRol = false;
    this.selectTO = new FiltroCatRolModel();
    this.botonAgregar = false;
  }

  ngOnInit() {
    this.getRoles(); 
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.getRoles();
        }
      }
    });
  }
  public notify() {
    if (this.isToggled) {
      this.isToggled = false;
      this.getRoles();
    } else {
      this.isToggled = true;
}
      
 
    this.selectTO = new FiltroCatRolModel();
  }
  logForm(form) {
    this.obtenerRol(form.value);
}
obtenerRol(form) {
  if (this.validarFiltros()) {
    //this.load = true;
    this.servicioUsuarios.obtenerRol(form).subscribe(
      response => {
        //this.load = false;
        this.lstCatRol = response.data;
        //this.blnMensajeFiltro = true;
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  } else {
    this.notificaciones.alerta('Seleccione un parametro de búsqueda');
  }
}
  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
  }
  validarFiltros() {
    if ((this.selectTO.id_rol !== null ) ||
      (this.selectTO.rol !== null && this.selectTO.rol !== '')
    ) {
      return true;
    } else {
      return false;
    }
  }
  getRoles() {
    //this.loaderGiro = true;
    this.servicioUsuarios.listarRol().subscribe(
      response => {
        this.lstCatRol = response.data;
        //this.loaderGiro = false;
      },
      error => {
      this.notificaciones.error(error);
      }
    );
  }
  agregarRol() {
    this.selectTO = new FiltroCatRolModel();
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-rol/datos-cat-rol'], { queryParams: {special: navigationExtras}  });
  }
  datosRol(rol: FiltroCatRolModel) {
    this.selectTO =  JSON.parse(JSON.stringify(rol));
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-rol/datos-cat-rol'], { queryParams: {special: navigationExtras}  });
  }
  limpiarFiltro() {
    this.getRoles(); 
    this.selectTO = new FiltroCatRolModel();
    this.blnBtnFiltro = this.validarFiltros();
  }
}
