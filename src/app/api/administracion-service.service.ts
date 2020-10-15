import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { FiltroCatVariableModel } from './../Modelos/catalogos/FiltroCatVariableModel';
import {AppSettings} from '../AppSettings';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(
    private _http: HttpClient
  ) { }

  /*CATALOGO VARIABLE*/
  guardarVarible(filtro: FiltroCatVariableModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/guarda_variable', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  obtenerVariable(filtro: FiltroCatVariableModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/list_variables', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
   listarVariables(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/list_variables', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarVariable(id_variable: number):Observable<any> {
    const body = JSON.stringify({'id_variable': id_variable});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminar_variable', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  buscarVariable(id_variable: number):Observable<any> {
    const body = JSON.stringify({'id_variable': id_variable});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/buscar_variable', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
}