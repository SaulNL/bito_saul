import { NegocioModel } from './../Modelos/NegocioModel';
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

  public obtnerTipoNegocio(): Observable<any> {
    return this.http.post(
        this.url+'api/servicio/lista/negocios',
        {},
        {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }

  buscarNegocio(idNegocio: any): Observable<any>{
    const body = JSON.stringify({id: idNegocio});
    return this.http.post(
        this.url + 'api/buscar/negocio', body,
        {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }

  categoriaPrincipal(id: number): Observable<any> {
    const body = JSON.stringify({id_tipo_negocio: id});
    return this.http.post(
        this.url+'api/servicio/tipoProductoServicio',
        body,
        {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }

  obtenerCategorias(id: any): Observable<any> {
    const body = JSON.stringify({id_giro: id});
    return this.http.post(
        this.url+'buscar/giro/categorias',
        body,
        {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {

      return data;
    }));
  }
    /**
   * Funcion para obtener el catalogo de organizaciones
   * @param id
   * @author Omar
   */
  obtenerCatOrganizaciones(): Observable<any> {
    return this.http.post(
      `${this.url}api/catalogo/organizaciones/obtener`,
      {},
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
   /**
   * Servicio para validar disponivilidad de url del negocio
   * @param url_negocio
   * @author Omar
   */
  verificarUrlNegocio(url_negocio: string): Observable<any> {
    const body = JSON.stringify({url_negocio: url_negocio});
    return this.http.post(
      this.url + 'api/negocio/verificar_url', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  guardar(negocio: NegocioModel): Observable<any> {
    const body = JSON.stringify(negocio);
    return this.http.post(
      this.url + 'api/proveedor/guardar_negocio', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
}
