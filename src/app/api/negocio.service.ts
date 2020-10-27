import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../AppSettings";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  constructor(
      private http: HttpClient
  ) {
  }

  url = `${AppSettings.API_ENDPOINT}`;

  obteneretalleNegocio(negocioo: string): Observable<any>{
    const body = JSON.stringify({negocio: negocioo });
    return this.http.post(
        this.url+'/proveedor/obtener/detalleNegocio',
        body,
        {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }

  public obtenerDetalleDeNegocio(negocio: number, tip ): Observable<any> {
    const body = JSON.stringify({id_negocio: negocio, tipo: tip});
    return this.http.post(
        this.url + 'api/lista/producto/negocio', body,
        {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }

  misNegocios(id: number): Observable<any> {
    const body = JSON.stringify({id_proveedor: id});
    return this.http.post(
      this.url + 'api/buscar/mis-negocios', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

}
