import { Component, OnInit } from '@angular/core';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { FiltroCatCategoriasModel } from '../../../../Modelos/catalogos/FiltroCatCategoriasModel';
import { LoadingController } from '@ionic/angular';
import { ToadNotificacionService } from './../../../../api/toad-notificacion.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cat-categoria',
  templateUrl: './cat-categoria.page.html',
  styleUrls: ['./cat-categoria.page.scss'],
})
export class CatCategoriaPage implements OnInit {
  public lstCatCategoria: Array<any>;
  public blnActivaDatosCategoria: boolean;
  public blnActivaFitro: boolean;
  selectTO: FiltroCatCategoriasModel;
  public filtro: FiltroCatCategoriasModel;
  public blnBtnFiltro: boolean;
  public loader: any;

  constructor(
    private servicioUsuarios: AdministracionService,
    public loadingController: LoadingController,
    private notificaciones: ToadNotificacionService,
    private router: Router,
    private active: ActivatedRoute
  ) {
    this.blnActivaDatosCategoria = true;
    this.lstCatCategoria = [];
    this.blnActivaFitro = false;
    this.filtro = new FiltroCatCategoriasModel();
  }

  ngOnInit() {
    this.getCategoria();
    this.active.queryParams.subscribe(params => {
      if (params && params.special) {
        if (params.special){
          this.getCategoria();
        }
      }
    });
  }

  async presentLoading() {
    this.loader = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'por favor espera...'
    });
    return this.loader.present();
  }
  validarFiltros() {
    if ((this.filtro.id_giro !== null && this.filtro.id_giro !== 0) ||
      (this.filtro.nombre !== null && this.filtro.nombre !== '')) {
      return true;
    } else {
      return false;
    }
  }
  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
  }
  public obtenerCategoria() {
    if (this.validarFiltros()) {
      this.presentLoading();
      this.servicioUsuarios.obtenerCategoria(this.filtro).subscribe(
        response => {
          this.loader.dismiss();
          this.lstCatCategoria = response.data;
          if (this.lstCatCategoria.length === 0) {
            this.notificaciones.alerta('Lo sentimos! No hay información con tu busqueda');
            this.getCategoria();
          }
          //   this.blnMensajeFiltro = true;
        },
        error => {
          this.notificaciones.error(error);
        }
      );
    } else {
      this.notificaciones.alerta('Seleccione un parametro de búsqueda');
    }
  }
  getCategoria() {

    this.servicioUsuarios.listarCategoria().subscribe(
      response => {
        this.lstCatCategoria = response.data;
        
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  datosCategoria(categoria: FiltroCatCategoriasModel) {
    this.selectTO = JSON.parse(JSON.stringify(categoria));
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(['/tabs/home/cat-categoria/datos-categoria'], { queryParams: {special: navigationExtras}  });
  }
  abrirFiltro() {
    if (this.blnActivaFitro) {
      this.blnActivaFitro = false;
    } else {
      this.blnActivaFitro = true;
    }
  }
  limpiarFiltro() {
    this.getCategoria();
    this.filtro = new FiltroCatCategoriasModel();
    this.blnBtnFiltro = this.validarFiltros();
  }
  agregarCategoria() {
    this.selectTO = new FiltroCatCategoriasModel();
    let navigationExtras = JSON.stringify(this.selectTO);
    this.router.navigate(['/tabs/home/cat-categoria/datos-categoria'], { queryParams: {special: navigationExtras}  });
  }
}
