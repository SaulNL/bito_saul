import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "../AppSettings";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FiltrosModel } from '../Modelos/FiltrosModel';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  url = `${AppSettings.API_ENDPOINT}`;

  constructor( private _http: HttpClient ) { }

  obtenerDetalle(id_promocion): Observable<any> {
    const body = JSON.stringify({id_promocion: id_promocion});
    return this._http.post(
      this.url + 'api/promocion/obtener/detalle', body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }

  buscarPromocinesPublicadasModulo(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({filtros: filtros});
    return this._http.post(
      this.url + 'api/promociones/buscar/publicadas', body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(res => {
      let jsOrigen: any;
      jsOrigen = res;

      const jsCategoria = new Array();
      let categoria = {
        id_categoria_negocio: undefined,
        nombre: undefined,
        id_giro: undefined,
        promociones: []
      };
      let promocion = {
        short: undefined
      };

      if (jsOrigen.data !== undefined && jsOrigen.data !== null) {
        let idCategoriaActual: number;
        const totalDatos = jsOrigen.data.length;
        let iterador = 0;
        jsOrigen.data.forEach(it => {

          if (idCategoriaActual !== Number(it.id_categoria_negocio)) {

            if (iterador > 0) {
              jsCategoria.push(categoria);
            }

            idCategoriaActual = Number(it.id_categoria_negocio);

            categoria = {
              id_categoria_negocio: it.id_categoria_negocio,
              nombre: it.categoria_negocio,
              id_giro: it.id_giro,
              promociones: []
            };

          }

          promocion = it;

          categoria.promociones.push(promocion);

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

}
