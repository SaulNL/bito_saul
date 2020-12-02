import { Component, OnInit } from '@angular/core';
import { FiltroCatTipoVentaModel } from '../../../../Modelos/catalogos/FiltroCatTipoVentaModel';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { ToadNotificacionService } from "../../../../api/toad-notificacion.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cat-tipo-venta',
  templateUrl: './cat-tipo-venta.page.html',
  styleUrls: ['./cat-tipo-venta.page.scss'],
})
export class CatTipoVentaPage implements OnInit {
  public isToggled: boolean;
  public loaderGiro: boolean;
  load: boolean;
  loader: boolean;
  selectTO: FiltroCatTipoVentaModel;
  public lstCatTipoVenta: Array<any>;
  public filtro: FiltroCatTipoVentaModel;
  public blnBtnFiltro: boolean;
  public blnMensajeFiltro: boolean;
  public blnActivaDatosTipoVenta: boolean;
  
  public mensaje = { principal: null, subMensaje: null };

  constructor(
    private notificacion: ToadNotificacionService,
    private adminServicios: AdministracionService,
    private router: Router,
    private active: ActivatedRoute
  ) { 
    this.isToggled = false;
    this.blnMensajeFiltro = false;
    this.blnActivaDatosTipoVenta = false;
    this.filtro = new FiltroCatTipoVentaModel();
  }

  ngOnInit() {
    this.getTipoVenta();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.getTipoVenta();
        }
      }
    });
  }
  
  public notify() {
    if (this.isToggled) {
      this.isToggled = false;
      this.getTipoVenta();
    } else {
      this.isToggled = true;
}
      
    this.filtro = new FiltroCatTipoVentaModel();
  }
  logForm(form) {
    this.obtenerTipoVenta(form.value);
}
  validarFiltros() {
    if ((this.filtro.id_tipo_venta !== null && this.filtro.id_tipo_venta !== 0) ||
      (this.filtro.nombre !== null && this.filtro.nombre !== '') ||
      (this.filtro.precio !== null && this.filtro.precio !== 0)) {
      return true;
    } else {
      return false;
    }
  }
  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
  }
  
  
  agregaTipoVenta() {
    this.selectTO = new FiltroCatTipoVentaModel();
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-tipo-venta/datos-cat-tipo-ventas'], { queryParams: {special: navigationExtras}  });
  }
  
  public obtenerTipoVenta(form) {
    if (this.validarFiltros()) {
      this.load = true;
      this.adminServicios.obtenerTipoVenta(form).subscribe(
        response => {
          this.load = false;
          this.lstCatTipoVenta = response.data;
          this.blnMensajeFiltro = true;
        },
        error => {
          this.notificacion.error(error);
        }
      );
    } else {
      this.notificacion.alerta('Seleccione un parametro de búsqueda');
    }
  }
  getTipoVenta() {
    //this.loaderGiro = true;
    this.adminServicios.listarTipoVenta().subscribe(
      response => {
        this.lstCatTipoVenta= response.data;
      //  this.loaderGiro = false;
      },
      error => {
        this.notificacion.error(error);
      }
    );
  }
  datosTipoVenta(venta: FiltroCatTipoVentaModel) {
    this.selectTO = JSON.parse(JSON.stringify(venta));
    let navigationExtras = JSON.stringify(this.selectTO);
  this.router.navigate(['/tabs/home/cat-tipo-venta/datos-cat-tipo-ventas'], { queryParams: {special: navigationExtras}  });
  }
  limpiarFiltro() {
    this.getTipoVenta();
    this.selectTO = new FiltroCatTipoVentaModel();
    this.blnBtnFiltro = this.validarFiltros();
  }
}
