import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { FiltroCatVariableModel } from './../Modelos/catalogos/FiltroCatVariableModel';
import { FiltroCatOrgModel } from './../Modelos/catalogos/FiltroCatOrgModel';
import {AppSettings} from '../AppSettings';
import { FiltroCatRolModel } from './../Modelos/catalogos/FiltroCatRolModel';
import { FiltroCatPermisosModel } from './../Modelos/catalogos/FiltroCatPermisosModel';
import { FiltroCatPalabrasResModel } from './../Modelos/catalogos/FiltroCatPalabrasResModel';
import {FiltroCatCategoriasModel} from './../Modelos/catalogos/FiltroCatCategoriasModel';
import {FiltroCatSubCategoriasModel} from './../Modelos/catalogos/FiltroCatSubcategoriasModel';
import { FiltroCatAvisosInfoModel } from './../Modelos/catalogos/FiltroCatAvisosInfoModel';
import { FiltroCatTipoVentaModel } from './../Modelos/catalogos/FiltroCatTipoVentaModel';
import { DenunciaModel } from './../Modelos/DenunciaModel';
import { FiltroCatTipoNegoModel } from './../Modelos/catalogos/FiltroCatTipoNegoModel';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(
    private _http: HttpClient,
    private http: HTTP
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
  /*CATALOGO AVISOS DE INFORMACIÓN*/
  obtenerAviso(filtro: FiltroCatAvisosInfoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listAvisos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listarAviso(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listAvisos', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  guardarAviso(filtro: FiltroCatAvisosInfoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/guardar/catAviso', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarAviso(id_aviso: number): Observable<any> {
    const body = JSON.stringify({'id_aviso': id_aviso});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminarAviso', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  validarAviso(aviso: any): Observable<any> {
    const body = JSON.stringify(aviso);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/cambiarEstatusAviso', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarPopever(filtro: FiltroCatAvisosInfoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/guardar/catAvisoPopover', body,
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
    /*GUARDAR DENUNCIA PARA NEGOCIO */
  guardarDenunciaNegocio(denuncia: DenunciaModel): Observable<any> {
    const body = JSON.stringify(denuncia);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(
      this.url + 'api/servicios/denunciar/enviar', body,AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /*OBTENER LA LISTA  DE DENUNCIAS */
  obtenerDenuncias(): Observable<any> {
    return this._http.post(
      this.url + 'api/servicios/denunciar/cunsulta', {},
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
busquedaNegocioDenuncias(nombre_comercial: string): Observable<any> {
    const body = JSON.stringify({'nombre_comercial': nombre_comercial});
    return this._http.post(
      this.url + 'api/servicios/denunciar/cunsulta',body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  /*CATALOGO TIPO VENTA*/
  obtenerTipoVenta(filtro: FiltroCatTipoVentaModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listVenta', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  listarTipoVenta(): Observable<any> {
    const body = JSON.stringify(null);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listVenta', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarTipoVenta(id_tipo_venta: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_venta': id_tipo_venta});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminarVenta', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  buscarTipoVenta(id_tipo_venta: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_venta': id_tipo_venta});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/buscarVenta', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarTipoVenta(filtro: FiltroCatTipoVentaModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/catTipoVenta', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  /*CATALOGO TIPO NEGOCIO*/
  obtenerTipoNego(filtro: FiltroCatTipoNegoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/catalogos/adminUser/listNegocio', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  eliminarTipoNego(id_tipo_negocio: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_negocio': id_tipo_negocio});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/eliminarNegocio', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  buscarTipoNego(id_tipo_negocio: number): Observable<any> {
    const body = JSON.stringify({'id_tipo_negocio': id_tipo_negocio});
    return this._http.post(
      this.url + 'api/catalogos/adminUser/buscarNegocio', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  guardarTipoNego(filtro: FiltroCatTipoNegoModel): Observable<any> {
    const body = JSON.stringify(filtro);
    return this._http.post(
      this.url + 'api/admin/catalogos/guardar/catTipoNegocio', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
}
