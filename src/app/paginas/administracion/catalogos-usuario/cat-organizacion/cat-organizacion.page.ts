import { Component, OnInit } from '@angular/core';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FiltroCatOrgModel } from 'src/app/Modelos/catalogos/FiltroCatOrgModel';
@Component({
  selector: 'app-cat-organizacion',
  templateUrl: './cat-organizacion.page.html',
  styleUrls: ['./cat-organizacion.page.scss'],
})
export class CatOrganizacionPage implements OnInit {
  public lstCatOrganizaciones: Array<any>;
  public blnActivaDatosOrganizacion: boolean;
  public selectTO:FiltroCatOrgModel;
  public filtro:FiltroCatOrgModel;
  public blnMensajeFiltro: boolean;
  public blnBtnFiltro: boolean;
  public blnTabla: boolean;
  public isToggled:boolean;
  constructor(
    private administracionService: AdministracionService,
    private router: Router,
    private active: ActivatedRoute
  ) {
    this.blnActivaDatosOrganizacion = false;
    this.filtro = new FiltroCatOrgModel();
    this.blnMensajeFiltro = false;
    this.blnTabla = true;
    this.isToggled=false;
  }



  ngOnInit() {
    this.getOrganizaciones();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.getOrganizaciones();
        }
      }
    });
  }

  public notify() {
    if (this.isToggled) {
      this.isToggled = false;
      this.getOrganizaciones();
    } else {
      this.isToggled = true;
}
    this.filtro = new FiltroCatOrgModel();
  }

  getOrganizaciones() {
    //this.loaderGiro = true;
    this.administracionService.listarOrganizaciones().subscribe(
      response => {
        this.lstCatOrganizaciones = response.data;
        //this.loaderGiro = false;
      },
      error => {
        //this._notificacionService.pushError(error);
      }
    );
  }

  datosOrganizaciones(organizacion: FiltroCatOrgModel) {
    this.selectTO = organizacion;
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-organizaciones/datos-cat-organizacion'], { queryParams: {special: navigationExtras}  });
  }

  agregaOrganizacion() {
    this.selectTO = new FiltroCatOrgModel();
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-organizaciones/datos-cat-organizacion'], { queryParams: {special: navigationExtras}  });
  }

  validarFiltros() {
    if ((this.filtro.id_organizacion !== null && this.filtro.id_organizacion !== 0) ||
      (this.filtro.nombre !== null && this.filtro.nombre !== '')) {
      return true;
    } else {
      return false;
    }
  }

  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
    
  }

  limpiarFiltro() {
    this.getOrganizaciones();
    //this.loader = false;
    this.filtro = new FiltroCatOrgModel();
    this.blnBtnFiltro = this.validarFiltros();
  }

  activarTabla() {
    if (!this.blnActivaDatosOrganizacion) {
      this.blnTabla = true;
    } else {
      this.blnTabla = false;
    }
  }

  public obtenerOrganizaciones() {
    if (this.validarFiltros()) {
      //this.load = true;
      this.administracionService.obtenerOrganizacion(this.filtro).subscribe(
        response => {
          //this.load = false;
          this.lstCatOrganizaciones = response.data;
          this.blnMensajeFiltro = true;
        },
        error => {
          //this._notificacionService.pushError(error);
        }
      );
    } else {
      //this._notificacionService.pushAlert('Seleccione un parametro de búsqueda');
    }
  }
}
