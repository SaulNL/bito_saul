import { Injectable } from '@angular/core';
import {AppSettings} from "../../../AppSettings";
import {Observable, from} from "rxjs";
import { PromocionesModel } from './../../../Modelos/busqueda/PromocionesModel';
import { UbicacionModel } from './../../../Modelos/busqueda/UbicacionModel';
import {FiltrosModel} from '../../../Modelos/FiltrosModel';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private url: string;
  constructor(
    private _http: HTTP
  ) { 
    this.url = AppSettings.API_ENDPOINT;
  }
   /**
   * Funcion para buscar las promociones publicadas
   * @author Omar
   */
  buscarPromocinesPublicadasFiltros(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({ filtros: filtros });
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + "api/promociones/buscar/publicadas",body,AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  obtenerAvisos(): Observable<any> {
    const body = JSON.stringify({});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + "api/catalogos/obtener/avisos",body, AppSettings.getHeaders())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));     
  }
    /**
   * Servicio para guardar quien vio la publicacion
   * @param promocion
   * @author Omar
   */
  guardarQuienVioPromocion(promocion: PromocionesModel, ubicacion: UbicacionModel = null): Observable<any> {
    const body = JSON.stringify({promocion: promocion, ubicacion: ubicacion});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + 'api/promociones/guardar/viste_mi_promocion', body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));  
  }
    /**
   * Funcion para obtener numero de quien vio la publicacion
   * @param id_promocion
   * @author Omar
   */
  obtenerNumeroQuienVioPublicacion(id_promocion): Observable<any> {
    const body = JSON.stringify({id_promocion: id_promocion});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + 'api/promociones/obtener/numero_viste_mi_promocion', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));  
  }
}
