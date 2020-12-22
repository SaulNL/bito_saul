import { Injectable } from '@angular/core';
import {AppSettings} from "../AppSettings";
import {HttpClient} from "@angular/common/http";
import {Observable, from} from "rxjs";
import {map} from "rxjs/operators";
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(
      private http: HttpClient,
      private httpNative: HTTP
  ) {
  }

  url = `${AppSettings.API_ENDPOINT}`;

  public obtenerDatos(filtro): Observable<any> {
    const body = JSON.stringify({filtros: filtro});
    this.httpNative.setDataSerializer("utf8");
    let datos = from(this.httpNative.post(`${this.url}api/negocios/obtener`,body, AppSettings.getHeaders())
    .then( data => {
      return JSON.parse(data.data);
    }));    

    return datos.pipe(map(data => {
      // return data;
      let jsOrigen: any;
      jsOrigen = data;

      const jsCategoria = new Array();
      let categoria = {
        id_categoria_negocio: undefined,
        nombre: undefined,
        id_giro: undefined,
        negocios: []
      };
      let negocio = {
        short: undefined
      };
      if (jsOrigen.data.lst_cat_negocios !== undefined && jsOrigen.data.lst_cat_negocios !== null && jsOrigen.data.lst_cat_negocios.length > 0) {

        let idCategoriaActual: number;
        const totalDatos = jsOrigen.data.lst_cat_negocios.length;
        let iterador = 0;
        jsOrigen.data.lst_cat_negocios.forEach(it => {

          if (idCategoriaActual !== Number(it.id_categoria_negocio)) {

            if (iterador > 0) {
              jsCategoria.push(categoria);
            }

            idCategoriaActual = Number(it.id_categoria_negocio);

            categoria = {
              id_categoria_negocio: it.id_categoria_negocio,
              nombre: it.categoria_negocio,
              id_giro: it.id_giro,
              negocios: []
            };

          }

          negocio = it;
          negocio.short = it.descripcion.substr(0, 25),

              categoria.negocios.push(negocio);

          if (iterador + 1 >= totalDatos) {
            jsCategoria.push(categoria);
          }

          iterador++;
        });
      }
      jsOrigen.data = jsCategoria;         
      return jsOrigen;
    }));
  }
  public obtenerCategorias():Observable<any>{
    return this.http.get(this.url + '/buscar/datos/inicio/allfiltro',
      { headers: {'Content-Type':'application/json'}}
    ).pipe(map(data => {
      return data;
    }));
  }
}
