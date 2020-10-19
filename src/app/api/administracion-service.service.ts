import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { FiltroCatVariableModel } from './../Modelos/catalogos/FiltroCatVariableModel';
import {AppSettings} from '../AppSettings';
import { FiltroCatRolModel } from './../Modelos/catalogos/FiltroCatRolModel';
import { FiltroCatPermisosModel } from './../Modelos/catalogos/FiltroCatPermisosModel';
import { FiltroCatPalabrasResModel } from './../Modelos/catalogos/FiltroCatPalabrasResModel';

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
  /*CATALOGO ROL*/
  obtenerRol(filtro: FiltroCatRolModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listaRoles', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listarRol(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listaRoles', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarRol(id_rol: number):Observable<any> {
    const body = JSON.stringify({'id_rol': id_rol});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminarRol', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  buscarRol(id_rol: number):Observable<any> {
    const body = JSON.stringify({'id_rol': id_rol});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/buscarRol', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarRol(filtro: FiltroCatRolModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/catRol', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  /*CATALOGO PERMISOS*/
  obtenerPermiso(filtro: FiltroCatPermisosModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listPermisos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listarPermiso(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listPermisos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarPermiso(id_permiso: number):Observable<any> {
    const body = JSON.stringify({'id_permiso': id_permiso});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminarPermisos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  buscarPermiso(id_permiso: number):Observable<any> {
    const body = JSON.stringify({'id_permiso': id_permiso});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/buscarPermisos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarPermiso(filtro: FiltroCatPermisosModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/catPermisos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  /*CATALOGO DE PALABRAS RESERVADAS*/
  obtenerPalabrasReservadas(filtro: FiltroCatPalabrasResModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/adminUser/catPalabrasReservadas', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listarPalabrasReservadas(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/admin/catalogos/adminUser/catPalabrasReservadas', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarPalabraReservada(id_palabra: number): Observable<any> {
    const body = JSON.stringify({'id_palabra': id_palabra});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminarPalabra', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarPalabraReservada(filtro: FiltroCatPalabrasResModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/PalabrasReservadas', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  validarPalabraReservada(palabra: any): Observable<any> {
    const body = JSON.stringify(palabra);
    return this._http.post(
      this.url + 'api/admin/catalogos/cambiarEstatus/PalabrasReservadas', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }

}

