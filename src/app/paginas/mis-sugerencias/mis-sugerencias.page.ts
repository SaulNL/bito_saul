import { Component, OnInit } from '@angular/core';
import {UtilsCls} from '../../utils/UtilsCls';
import {BusquedaService} from '../../api/busqueda.service';
import {ToadNotificacionService} from '../../api/toad-notificacion.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-mis-sugerencias',
  templateUrl: './mis-sugerencias.page.html',
  styleUrls: ['./mis-sugerencias.page.scss'],
  providers: [UtilsCls]
})
export class MisSugerenciasPage implements OnInit {

  public listaVerMas: any[] = [];
  public user: any;
  public idNegocio: number;
  public tFiltro: boolean;
  public existeSesion: boolean;

  constructor(
      private principalSercicio: BusquedaService,
      private util: UtilsCls,
      private notificaciones: ToadNotificacionService,
      private ruta: Router,
  ) {
    this.listaVerMas = [];
    this.user = this.util.getUserData();
    this.existeSesion = this.util.existe_sesion();
  }

  ngOnInit() {
    this.Sugerencias();
  }

  public Sugerencias() {
    this.principalSercicio.obtenerPrincipalInicio()
        .subscribe(
            (response) => {
              if (response.code === 200) {
                const listaCategorias = response.data;
                let uno = listaCategorias[0].negocios.slice(0, 10);
                let dos = listaCategorias[1].negocios.slice(0, 10);
                let tres = listaCategorias[2].negocios.slice(0, 10);
                this.listaVerMas = [
                    {'nombre': 'Promociones', 'negocios': uno}, {
                  'nombre': 'Productos y Servicios',
                  'negocios': dos
                }, {'nombre': 'Negocios', 'negocios': tres}];
              }
            }, (error) => {
            });
  }

  negocioRuta(negocioURL, proveedor) {

    this.idNegocio = proveedor;
    setTimeout(() => {
      if (negocioURL == "") {
        this.notificaciones.error(
            "Este negocio aún no cumple los requisitos mínimos"
        );
      } else {

        if (this.tFiltro === true) {
          localStorage.setItem("isRedirected", "false");
          this.ruta.navigate(["/tabs/negocio/" + negocioURL]);


        } else {
          localStorage.setItem("isRedirected", "true");
          this.ruta.navigate(["/tabs/negocio/" + negocioURL]);
        }

      }
    }, 1000);

  }
}
