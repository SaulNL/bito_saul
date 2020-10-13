import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import{FiltrosModel} from '../../../Modelos/FiltrosModel';

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
}
