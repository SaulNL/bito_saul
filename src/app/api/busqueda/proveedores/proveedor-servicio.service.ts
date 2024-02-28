import { Injectable } from '@angular/core';
import { AppSettings } from "../../../AppSettings";
import { from, Observable } from "rxjs";
import { MsNegocioModel } from './../../../Modelos/busqueda/MsNegocioModel';
import { HTTP } from '@ionic-native/http/ngx';
import { UsuarioSistemaModel } from './../../../Modelos/UsuarioSistemaModel';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedorServicioService {
  private url: string;
  selectedObj: any;
  constructor(
    private _http: HTTP
  ) {
    this.url = AppSettings.API_ENDPOINT;
  }

  setSelectedObj(obj: any) {
    this.selectedObj = obj;
  }

  getSelectedObj() {
    return this.selectedObj;
  }
  /**
   * Servicio para guardar los comentarios
   * @param negocio
   * @author Omar
   */
  enviarCalificacionNegocio(negocio: MsNegocioModel): Observable<any> {
    const body = JSON.stringify(negocio);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      `${this.url}api/proveedor/guardar/calificacion`,
      body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  /**
 * funcion para saber si ya calificaste el negocio
 * @param negocio
 * @author Omar
 */
  obtenerEstatusCalificacionUsuario(usuario): Observable<any> {
    const body = JSON.stringify(usuario);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      `${this.url}api/proveedor/obtener/estatus/calificacion`,
      body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerSucursales(id): Observable<any> {
    const body = JSON.stringify({ id_negocio: id });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      `${this.url}api/buscar/sucursales`,
      body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerContenidosNegocio(id): Observable<any> {
    const body = JSON.stringify({ id_negocio: id });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      `${this.url}api/contenidos/contenidosNegocio`,
      body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  public darLike(proveedor: MsNegocioModel, usuario: UsuarioSistemaModel): Observable<any> {
    const body = JSON.stringify({ proveedor: proveedor, usuario: usuario });
    return from(this._http.post(
      this.url + 'api/negocio/dar_like', body,
      AppSettings.getHeadersToken())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      })).pipe(map(data => {
        return data;
      }));
  }

}
