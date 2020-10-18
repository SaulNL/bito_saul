import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { FiltroCatVariableModel } from './../Modelos/catalogos/FiltroCatVariableModel';
import { FiltroCatOrgModel } from './../Modelos/catalogos/FiltroCatOrgModel';
import {AppSettings} from '../AppSettings';
import {FiltroCatCategoriasModel} from './../Modelos/catalogos/FiltroCatCategoriasModel';
import {FiltroCatSubCategoriasModel} from './../Modelos/catalogos/FiltroCatSubcategoriasModel';

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
  /*CATALOGO ORGANIZACION*/
  obtenerOrganizacion(filtro: FiltroCatOrgModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/list_organizaciones', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listarOrganizaciones(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/list_organizaciones', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarOrganizacion(id_organizacion: number):Observable<any> {
    const body = JSON.stringify({'id_organizacion': id_organizacion});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminar_organizaciones', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  buscarOrganizacion(id_organizacion: number):Observable<any> {
    const body = JSON.stringify({'id_organizacion': id_organizacion});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/buscar_organizacion', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarCatOrganizacion(filtro: FiltroCatOrgModel): Observable<any> {
    console.log('guardar servicio');
    console.log(filtro);
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/opganizacion', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
   /*CATALOGO CATEGORIA*/
   obtenerCategoria(filtro: FiltroCatCategoriasModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listGiro', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listarCategoria(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listGiro', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarCategoria(id_giro: number): Observable<any> {
    const body = JSON.stringify({'id_giro': id_giro});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminarGiro', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  buscarCategoria(id_giro: number): Observable<any> {
    const body = JSON.stringify({'id_giro': id_giro});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/buscarGiro', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarCategoria(filtro: FiltroCatCategoriasModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/catGiro', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listaSubcategoriaCategoria(id_giro: number): Observable<any> {
    const body = JSON.stringify({'id_giro': id_giro});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listGirosId', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
    /*CATALOGO SUBCATEGORIA*/
    obtenerSubcate(filtro: FiltroCatSubCategoriasModel): Observable<any> {
      const body = JSON.stringify(filtro);
      return this._http.post(
        this.url + 'api/catalogos/adminUser/listCategorias', body,
        {headers: AppSettings.getHeadersToken()}
      ).pipe(map(res => {
        return res;
      }));
    }
    listarSubcategoria(): Observable<any> {
      const body = JSON.stringify(null);
      return this._http.post(
        this.url + 'api/catalogos/adminUser/listCategorias', body,
        {headers: AppSettings.getHeadersToken()}
      ).pipe(map(res => {
        return res;
      }));
    }
    eliminarSubcategoria(id_categoria: number): Observable<any> {
      const body = JSON.stringify({'id_categoria': id_categoria});
      return this._http.post(
        this.url + 'api/catalogos/adminUser/eliminarCategoria', body,
        {headers: AppSettings.getHeadersToken()}
      ).pipe(map(data => {
        return data;
      }));
    }
    buscarSubcategoria(id_categoria: number): Observable<any> {
      const body = JSON.stringify({'id_categoria': id_categoria});
      return this._http.post(
        this.url + 'api/catalogos/adminUser/buscarCategoria', body,
        {headers: AppSettings.getHeadersToken()}
      ).pipe(map(data => {
        return data;
      }));
    }
    guardarSubcategoria(filtro: FiltroCatSubCategoriasModel): Observable<any> {
      const body = JSON.stringify(filtro);
      return this._http.post(
        this.url + 'api/admin/catalogos/guardar/catCategoria', body,
        {headers: AppSettings.getHeadersToken()}
      ).pipe(map(res => {
        return res;
      }));
    }
    listarTipoNego(): Observable<any> {
      const body = JSON.stringify(null);
      return this._http.post(
        this.url + 'api/catalogos/adminUser/listNegocio', body,
        {headers: AppSettings.getHeadersToken()}
      ).pipe(map(res => {
        return res;
      }));
    }
}