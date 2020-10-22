import { Component, OnInit } from '@angular/core';
import { FiltroCatTipoVentaModel } from '../../../../Modelos/catalogos/FiltroCatTipoVentaModel';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { ToadNotificacionService } from "../../../../api/toad-notificacion.service";

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
  public botonAgregar: boolean;
  
  public mensaje = { principal: null, subMensaje: null };

  constructor(
    private notificacion: ToadNotificacionService,
    private adminServicios: AdministracionService
  ) { 
    this.isToggled = false;
    this.blnMensajeFiltro = false;
    this.blnActivaDatosTipoVenta = false;
    this.filtro = new FiltroCatTipoVentaModel();
    this.botonAgregar = false;
  }

  ngOnInit() {
    this.getTipoVenta();
  }
  
  public notify() {
    if (this.isToggled === false) {
      this.getTipoVenta();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.selectTO = new FiltroCatTipoVentaModel();
    this.blnActivaDatosTipoVenta = true;
    //this.activarTabla();
    this.botonAgregar = true;
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
    this.blnActivaDatosTipoVenta = true;
    //this.activarTabla();
    //window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
}
