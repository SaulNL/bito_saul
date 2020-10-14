import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../AppSettings";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {FiltrosModel} from "../Modelos/FiltrosModel";
import {ProductoModel} from "../Modelos/ProductoModel";
import {UsuarioSistemaModel} from "../Modelos/UsuarioSistemaModel";

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(
      private _http: HttpClient
  ) {
  }
  /**
   * Funcion para obtener los productos
   * @author Omar
   */
  public obtenerProductos(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify(filtros);
    return this._http.post(
        this.url + 'api/productos/obtener', body,
        {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
  /**
   * Funcion para obtener el negocio
   * @param negocio
   * @author Omar
   */
  public obtenerNegocioById(id_negocio: number):Observable<any>{
    const body = JSON.stringify({id_negocio:id_negocio});
    return this._http.post(
        this.url + 'api/productos/obtener/negocio', body,
        {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
  /**
   * Servicio para dar like
   * @author Omar
   * @param producto
   * @param usuario
   */
  public darLike(producto: ProductoModel, usuario: UsuarioSistemaModel):Observable<any>{
    console.log(producto);
    const body = JSON.stringify({producto: producto, usuario: usuario});
    return this._http.post(
        this.url + 'api/productos/dar_like', body,
        {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
}
