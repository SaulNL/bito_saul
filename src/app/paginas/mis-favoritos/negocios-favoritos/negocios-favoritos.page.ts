import { Component, OnInit } from '@angular/core';
import {UtilsCls} from '../../../utils/UtilsCls';
import {PersonaService} from '../../../api/persona.service';
import {Router} from '@angular/router';
import {ToadNotificacionService} from '../../../api/toad-notificacion.service';
import {MsNegocioModel} from '../../../Modelos/busqueda/MsNegocioModel';
import {ProveedorServicioService} from '../../../api/busqueda/proveedores/proveedor-servicio.service';

@Component({
  selector: 'app-negocios-favoritos',
  templateUrl: './negocios-favoritos.page.html',
  styleUrls: ['./negocios-favoritos.page.scss'],
})
export class NegociosFavoritosPage implements OnInit {

  public user: any;
  public listaNegocios: any;
  public motrarContacto: boolean;
  public tamanoLista: number;

  constructor(
      private util: UtilsCls,
      private personaService: PersonaService,
      private router: Router,
      private notificaciones: ToadNotificacionService,
      private serviceProveedores: ProveedorServicioService,
  ) {
    this.user = this.util.getUserData();
    this.tamanoLista = 0;
  }

  ngOnInit() {
    this.obtenerNegociosFavoritos();
    this.motrarContacto = true;
  }

  public obtenerNegociosFavoritos() {

    if (this.user.id_persona !== undefined) {
      console.log('entras a consumit el servicio');
      console.log(this.user.id_persona);
      this.personaService.obtenerNegociosFavoritos(this.user.id_persona).subscribe(

          response => {
            if (response.code === 200) {
              this.listaNegocios = response.data;
              this.tamanoLista = this.listaNegocios.length;

            }
          },
          error => {
            this.tamanoLista = 0;
          });
    }
  }

  abrirNegocio(negocioURL) {
    if (negocioURL == "") {
      this.notificaciones.error('Este negocio aún no cumple los requisitos mínimos');
    } else {
      this.router.navigate(['/tabs/negocio/' + negocioURL], {
        queryParams: { route: true }
      });
    }
  }

  public darDislike(negocio: MsNegocioModel) {
      this.serviceProveedores.darLike(negocio, this.user).subscribe(
          response => {
            if (response.code === 200) {
              negocio.likes = response.data;
              this.notificaciones.exito(response.message);
            } else {

              let index = this.listaNegocios.indexOf(negocio);

              if (index > -1) {
                this.listaNegocios.splice(index, 1);
              }

              this.notificaciones.alerta(response.message);
            }

          },
          error => {
          });
  }

  regresar() {
    this.router.navigate(['/tabs/home/mis-favoritos']);
  }

}
