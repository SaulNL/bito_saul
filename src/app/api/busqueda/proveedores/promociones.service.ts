import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { PromocionesModel } from './../../../Modelos/busqueda/PromocionesModel';
import { UbicacionModel } from './../../../Modelos/busqueda/UbicacionModel';
import {FiltrosModel} from '../../../Modelos/FiltrosModel';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private url: string;
  constructor(
    private http: HttpClient
  ) { 
    this.url = AppSettings.API_ENDPOINT;
  }
   /**
   * Funcion para buscar las promociones publicadas
   * @author Omar
   */
  buscarPromocinesPublicadasFiltros(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({filtros: filtros});
    return this.http.post(
      this.url + 'api/promociones/buscar/publicadas', body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(res => {
      return res;
    }));
  }
  obtenerAvisos(): Observable<any> {
    const body = JSON.stringify(null);
    return this.http.post(
      this.url + 'api/catalogos/obtener/avisos', body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(res => {
      return res;
    }));
  }
    /**
   * Servicio para guardar quien vio la publicacion
   * @param promocion
   * @author Omar
   */
  guardarQuienVioPromocion(promocion: PromocionesModel, ubicacion: UbicacionModel = null): Observable<any> {
    const body = JSON.stringify({promocion: promocion, ubicacion: ubicacion});
    return this.http.post(
      this.url + 'api/promociones/guardar/viste_mi_promocion', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
    /**
   * Funcion para obtener numero de quien vio la publicacion
   * @param id_promocion
   * @author Omar
   */
  obtenerNumeroQuienVioPublicacion(id_promocion): Observable<any> {
    const body = JSON.stringify({id_promocion: id_promocion});
    return this.http.post(
      this.url + 'api/promociones/obtener/numero_viste_mi_promocion', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
}
