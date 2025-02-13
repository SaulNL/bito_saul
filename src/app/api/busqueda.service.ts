import { Injectable } from '@angular/core';
import { AppSettings } from "../AppSettings";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { HTTP } from '@ionic-native/http/ngx';
import { IMsNegocio } from '../interfaces/IMsNegocioModel';
import { CategoriaNegocioUtil } from '../utils/servicios/categoria-negocio/categoria-negocio-util';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(
    private http: HTTP,
    private _http: HttpClient
  ) {
  }

  url = `${AppSettings.API_ENDPOINT}`;
  public obtenerDatos(filtro, pagina: number): Observable<any> {
    const body = JSON.stringify({ filtros: filtro, page: pagina });
    this.http.setDataSerializer("utf8");

    let datos = from(this.http.post(`${this.url}api/negocios/obtener`, body, AppSettings.getHeaders())
      .then(data => {

        return JSON.parse(data.data);
      }));

    return datos.pipe(map(data => {
      let respuesta: any = data;
      let msNegocios = respuesta.data.lst_cat_negocios.data as Array<IMsNegocio>;
      respuesta.data.lst_cat_negocios.data = CategoriaNegocioUtil.filtrarNegociosPorCategorias(msNegocios);
      return respuesta;
    }));
  }

  public obtenerNegocioPorCategoria(filtro, pagina: number): Promise<any> {
    const body = JSON.stringify({ filtros: filtro, page: pagina });
    this.http.setDataSerializer("utf8");
    return this.http.post(`${this.url}api/negocios/obtener`, body, AppSettings.getHeaders())
      .then(data => {
        let respuesta: any = JSON.parse(data.data);

        /* Se valida que tenga la propiedad "data", debido el backend no lo manda en el páginado
        * --> Refactorizar, esto lo debe hacer el backend, no el frontend,
        * el backend debe ser encargado de otorgar la estructura correcta al front
        */
        let msNegocios: Array<IMsNegocio>;
        if (respuesta.data.lst_cat_negocios.hasOwnProperty("data")) {
          msNegocios = respuesta.data.lst_cat_negocios.data as Array<IMsNegocio>;
        } else {
          /**
           * son las propiedades que se usan para el páginado
           * así evitar que tengan nulo y mande error,
           * se establecen así que el backend no manda páginado, validar, no es lo correcto
           */
          msNegocios = respuesta.data.lst_cat_negocios as Array<IMsNegocio>;
          respuesta.data.lst_cat_negocios.current_page = 1;
          respuesta.data.lst_cat_negocios.total = 1;
          respuesta.data.lst_cat_negocios.per_page = 1;
          respuesta.data.lst_cat_negocios.to = 1;
        }
        respuesta.data.lst_cat_negocios.data = CategoriaNegocioUtil.filtrarNegociosPorCategorias(msNegocios);
        return respuesta;
      });
  }
  public obtenerNumeroPaginas(filtro, pagina: number): Promise<any> {
    const body = JSON.stringify({ filtros: filtro, page: pagina });
    this.http.setDataSerializer("utf8");
    return this.http.post(`${this.url}api/negocios/obtenerNumeroPaginas`, body, AppSettings.getHeaders())
      .then(data => {
        let respuesta: any = JSON.parse(data.data);
        return respuesta;
      });
  }

  public obtenerCategorias(pagina: number): Observable<any> {
    const url = this.url + '/buscar/datos/inicio/allfiltro?page=' + pagina;
    let datos = from(this.http.get(url, {},
      { 'Content-Type': 'application/json' })
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));

    return datos.pipe(map(data => {
      return data;
    }));
  }

  obtenerCategoriasGiros(idGiro): Observable<any> {
    const body = JSON.stringify({ id_giro: idGiro });
    return this._http.post(
      `${this.url}buscar/giro/categoriasProvedores`, body,
      { headers: AppSettings.getHeaders() }
    ).pipe(map(data => {
      return data;
    }));
  }

  obtenerBannerAvisos(): Observable<any> {
    const body = JSON.stringify({});
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/catalogos/obtener/avisosInferior', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerGiros(): Observable<any> {
    const body = JSON.stringify({});
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'buscar/giros', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerPrincipalInicio(): Observable<any> {
    const body = JSON.stringify({});
    this.http.setDataSerializer('utf8');
    return from(this.http.post(
      this.url + 'api/negocios/obtenerPrincipalInicio',
      body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  // ESTE SERVICIO ERA PARA TRAER LA LISTA DE SOLO LOS PRIMEROS DIEZ(CONVENIO, PROMOCIÓN Y MAS VISTOS )
  // obtenerPrincipalInicioTodos(data: any): Observable<any> {
  //   const body = JSON.stringify(data);
  //   this.http.setDataSerializer('utf8');
  //   return from(this.http.post(
  //       this.url + 'api/negocios/obtenerPrincipalInicioTodos',
  //       body,  AppSettings.getHeaders())
  //       .then((data) => {
  //           return JSON.parse(data.data);
  //       })
  //       .catch((error) => {
  //           return error;
  //       }));
  // }

  public obtenerNegociosTodosMapa(): Promise<any> {
    const body = JSON.stringify({});
    this.http.setDataSerializer("utf8");
    return this.http.post(`${this.url}api/negocios/obtenerTodosMapa`, body, AppSettings.getHeaders())
      .then(data => {
        let respuesta: any = JSON.parse(data.data);
        return respuesta;
      });
  }

  public obtenerNegociosTodosFiltroMapa(filtro): Promise<any> {
    const body = JSON.stringify({ filtros: filtro });
    this.http.setDataSerializer("utf8");
    return this.http.post(`${this.url}api/negocios/obtenerTodosMapa`, body, AppSettings.getHeaders())
      .then(data => {
        let respuesta: any = JSON.parse(data.data);
        return respuesta;
      });
  }


  public getDatosNegocioSinMapearCategoría(filtro, pagina: number): Observable<any> {
    const body = JSON.stringify({ filtros: filtro, page: pagina });
    this.http.setDataSerializer("utf8");
    let datos = from(this.http.post(`${this.url}api/negocios/obtener`, body, AppSettings.getHeaders())
      .then(data => {
        return JSON.parse(data.data);
      }));
    return datos;
  }

}
