import { AppSettings } from './../AppSettings';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralServicesService {
  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient
  ) { }

  public getEstadosWS(): Observable<any> {
    return this._http.post(
      `${this.url}api/catalogo/estado/list`,
      {},
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
  public getMunicipios(id_estado: number): Observable<any> {
    const body = JSON.stringify({id_estado: id_estado});
    return this._http.post(
      `${this.url}api/catalogo/municipio/list`,
      body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {

      return data;
    }));
  }

  public getLocalidad(id_municipio: number): Observable<any> {
    const body = JSON.stringify({id_municipio: id_municipio});
    return this._http.post(
      `${this.url}api/catalogo/localidad/list`,
      body, {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {

      return data;
    }));
  }

  /**
   * Funcion para enviar el comentario por correo
   * @param datos
   * @author Omar
   */
  enviarComentarioCorreo(datos:any): Observable<any>{
    const body = JSON.stringify(datos);
    return this._http.post(
      `${this.url}api/comentario/enviar`,
      body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
}
