import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FiltroCatPalabrasResModel } from "../../../../Modelos/catalogos/FiltroCatPalabrasResModel";
import { AdministracionService } from "../../../../api/administracion-service.service";
import { ToadNotificacionService } from "../../../../api/toad-notificacion.service";

@Component({
  selector: "app-cat-palabra-reservadas",
  templateUrl: "./cat-palabra-reservadas.page.html",
  styleUrls: ["./cat-palabra-reservadas.page.scss"],
})
export class CatPalabraReservadasPage implements OnInit {
  public isToggled: boolean;
  
  public blnBtnFiltro: boolean;
  public lstCatPalabras: Array<any>;
  selectTO: FiltroCatPalabrasResModel;
  public filtro: FiltroCatPalabrasResModel;
  public blnActivaDatosPalabra: boolean;
  public botonAgregar: boolean;
  public cambios: number;
  constructor(
    
    private notificaciones: ToadNotificacionService,
    private servicioUsuarios: AdministracionService
  ) {
    this.isToggled = false;
    this.filtro = new FiltroCatPalabrasResModel();
    this.blnActivaDatosPalabra = false;
    this.lstCatPalabras = [];
    this.botonAgregar = false;
    
  }

  ngOnInit() {
    this.getPalabras();
  }
  getPalabras() {
    //this.loaderGiro = true;
    this.servicioUsuarios.listarPalabrasReservadas().subscribe(
      (response) => {
        this.lstCatPalabras = response.data;
        //this.loaderGiro = false;
            },
      (error) => {
        this.notificaciones.error(error);
      }
    );
  }
  public notify() {
    if (this.isToggled) {
      this.isToggled = false;
      this.getPalabras();
    } else {
      this.isToggled = true;
}
    this.filtro = new FiltroCatPalabrasResModel();
  }
  logForm(form) {
    this.obtenerPalabras(form.value);
  }
  public obtenerPalabras(form) {
    if (this.validarFiltros()) {
      //this.load = true;
      this.servicioUsuarios.obtenerPalabrasReservadas(form).subscribe(
        (response) => {
          //this.load = false;
          this.lstCatPalabras = response.data;
          //this.blnMensajeFiltro = true;
        },
        (error) => {
          this.notificaciones.error(error);
        }
      );
    } else {
      this.notificaciones.alerta("Seleccione un parametro de búsqueda");
    }
  }
  validarFiltros() {
    if (this.filtro.palabra !== null && this.filtro.palabra !== "") {
      return true;
    } else {
      return false;
    }
  }
  setBlnFiltro() {
    this.blnBtnFiltro = this.validarFiltros();
  }
  datosPalabra(palabra: FiltroCatPalabrasResModel) {
    this.selectTO = JSON.parse(JSON.stringify(palabra));
    this.blnActivaDatosPalabra = true;
    //this.activarTabla();
    //window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  agregarPalabra() {
   // window.scrollTo({ top: 0, behavior: 'smooth' });
    this.selectTO = new FiltroCatPalabrasResModel();
    this.blnActivaDatosPalabra = true;
   // this.activarTabla();
   this.botonAgregar = true;
  }
  validarActivo(palabra: FiltroCatPalabrasResModel) {
    palabra.activo = palabra.activo === 1 ? 0 : 1;
    this.servicioUsuarios.validarPalabraReservada(palabra).subscribe(
      respuesta => {
        this.notificaciones.exito('El registro se actualizó con éxito');
      },
      error => {
        console.log(error);
        palabra.activo = palabra.activo === 1 ? 0 : 1;
        this.notificaciones.error('Ocurrio un error al actualizar el registro intente nuevamente');
      }
    );
  }
}
