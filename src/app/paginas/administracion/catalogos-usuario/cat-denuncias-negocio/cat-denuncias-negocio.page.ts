import { Component, OnInit } from '@angular/core';
import { DenunciaModel } from '../../../../Modelos/DenunciaModel';
import { AdministracionService } from '../../../../api/administracion-service.service';
import { ToadNotificacionService } from "../../../../api/toad-notificacion.service";

@Component({
  selector: 'app-cat-denuncias-negocio',
  templateUrl: './cat-denuncias-negocio.page.html',
  styleUrls: ['./cat-denuncias-negocio.page.scss'],
})
export class CatDenunciasNegocioPage implements OnInit {
  public listaDenunciaNegocio: Array<any>;
  public listaDenunciaPreguntas: Array<any>;
  public filtro: string;
  public selectTO: DenunciaModel;
  public loaderGiro: boolean;
  public loader: boolean;
  public blnBtnFiltro: boolean;
  loadbuscar: boolean;
  public isToggled: boolean;
  public blnActivaComentarios: boolean;

  constructor(
    private adminServicio: AdministracionService,
    private notificaciones: ToadNotificacionService
  ) { 
    this.blnActivaComentarios = false;
    this.filtro = '';
    this.listaDenunciaNegocio = [];
    this.listaDenunciaPreguntas = [];
  }

  ngOnInit() {
    this.obtenerDenunciasNegocio();
  }
  public notify() {
    if (this.isToggled) {
      this.isToggled = false;
      this.obtenerDenunciasNegocio();
    } else {
      this.isToggled = true;
    }
    this.filtro = '';
  }
  
  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
  }
  validarFiltros() {
    if ((this.filtro !== null && this.filtro !== '')) {
      return true;
    } else {
      return false;
    }
  }

  obtenerDenunciasNegocio() {
    this.loaderGiro = true;
    this.adminServicio.obtenerDenuncias().subscribe(
      response => {
        this.listaDenunciaNegocio = response.data;
        this.loaderGiro = false;
      },
      error => {
        this.notificaciones.error(error);
      }
    );
  }
  public busquedaNegocio() {
    if (this.validarFiltros()) {
      //this.loadbuscar = true;
      //console.log(this.filtro);
      this.adminServicio.busquedaNegocioDenuncias(this.filtro).subscribe(
        response => {
          //this.loadbuscar = false;
          this.listaDenunciaNegocio = response.data;
        },
        error => {
          this.notificaciones.error(error);
        }
      );
    } else {
      this.notificaciones.alerta('Seleccione un parametro de búsqueda');
    }
  }
  datosNegocio(denuncia: DenunciaModel) {
    this.selectTO =  JSON.parse(JSON.stringify(denuncia));
    this.blnActivaComentarios = true;
    //this.activarTabla();
    //window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
