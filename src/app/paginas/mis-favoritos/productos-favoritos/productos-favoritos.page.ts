import { Component, OnInit } from '@angular/core';
import {UtilsCls} from '../../../utils/UtilsCls';
import {PersonaService} from '../../../api/persona.service';

@Component({
  selector: 'app-productos-favoritos',
  templateUrl: './productos-favoritos.page.html',
  styleUrls: ['./productos-favoritos.page.scss'],
})
export class ProductosFavoritosPage implements OnInit {

  public user: any;
  public listaProductos: any;

  constructor(
      private util: UtilsCls,
      private personaService: PersonaService,
  ) {
    this.user = this.util.getUserData();
  }

  ngOnInit() {
    this.obtenerProductosFavoritos();
    console.log(this.user);
  }


  public obtenerProductosFavoritos() {

    if (this.user.id_persona !== undefined) {
      console.log('entras a consumit el servicio');
      console.log(this.user.id_persona);
      this.personaService.obtenerProductosFavoritos(this.user.id_persona).subscribe(

          response => {
            if (response.code === 200) {
              this.listaProductos = response.data.data;
              console.log(this.listaProductos, response);

            }
          },
          error => {
            console.log(error);
          });
    }
  }

}
