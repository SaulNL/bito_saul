import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../../../AppSettings";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { MsNegocioModel } from './../../../Modelos/busqueda/MsNegocioModel';


@Injectable({
  providedIn: 'root'
})
export class ProveedorServicioService {
  private url: string;
  constructor(
    private http: HttpClient
  ) {
    this.url = AppSettings.API_ENDPOINT;
   }
  /**
   * Servicio para guardar los comentarios
   * @param negocio
   * @author Omar
   */
  enviarCalificacionNegocio(negocio: MsNegocioModel): Observable<any> {
    const body = JSON.stringify(negocio);
    return this.http.post(
      `${this.url}api/proveedor/guardar/calificacion`,
      body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
    /**
   * funcion para saber si ya calificaste el negocio
   * @param negocio
   * @author Omar
   */
  obtenerEstatusCalificacionUsuario(usuario): Observable<any> {
    const body = JSON.stringify(usuario);
    return this.http.post(
      `${this.url}api/proveedor/obtener/estatus/calificacion`,
      body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
}
