import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { SolicitudesModel } from './../Modelos/SolicitudesModel';
import {AppSettings} from '../AppSettings';
import {PublicacionesModel } from './../Modelos/PublicacionesModel';
import { UbicacionModel } from '../Modelos/busqueda/UbicacionModel';
import { FiltrosModel } from '../Modelos/busqueda/FiltrosModel';
import { PostulacionModel } from '../Modelos/PostulacionModel';
import { PostuladosModel } from '../Modelos/PostuladosModel';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient
  ) { }
  
  /**
   * Servicio para buscar una solicitud
   * @param solicitud
   * @author Omar
   */
  buscar(solicitud: SolicitudesModel): Observable<any> {
    const body = JSON.stringify(solicitud);
    return this._http.post(
      this.url + 'api/solicitudes/persona', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
    /**
   * Servicio para buscar publicaciones
   * @author Omar
   */
  buscarPublicaciones(): Observable<any> {
    return this._http.post(
      this.url + '/api/publicaciones/buscar', {},
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
    /**
   * Servicio para guardar una solicitud
   * @param variable
   */
  guardar(variable: SolicitudesModel): Observable<any> {
    const body = JSON.stringify(variable);
    return this._http.post(
      this.url + '/api/solicitudes/guardar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
    /**
   * Servicio para eliminar la solicitud
   * @param variable
   * @author Omar
   */
  eliminar(variable: SolicitudesModel) {
    const body = JSON.stringify(variable);
    return this._http.post(
      this.url + '/api/solicitudes/eliminar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
   /**
   * Servicio para guardar la publicacion
   * @param solicitus
   * @author Omar
   */
  guardarPublicacion(publicacion: PublicacionesModel) {
    const body = JSON.stringify(publicacion);
    return this._http.post(
      this.url + '/api/solicitudes/publicar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
  /**
   * Funcion para obtener detalle de quien vio la publicacion
   * @param id_solicitud
   * @author Omar
   */
  obtenerQuienVioPublicacion(idSolicitud): Observable<any>{
    const body = JSON.stringify({'id_solicitud': idSolicitud});
    return this._http.post(
      this.url + '/api/solicitudes/obtener/viste_mi_solicitud', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  /**
   * Funcion para obtener numero de quien vio la publicacion
   * @param idSolicitud
   * @author Omar
   */
  obtenerNumeroQuienVioPublicacion(idSolicitud): Observable<any>{
    const body = JSON.stringify({'id_solicitud': idSolicitud});
    return this._http.post(
      this.url + '/api/solicitudes/obtener/numero_viste_mi_solicitud', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
    /**
   * Servicio para guardar quien vio la publicacion
   * @param solicitud
   * @author Omar
   */
  guardarQuienVioSolicitud(solicitud: SolicitudesModel, ubicacion: UbicacionModel): Observable<any> {
    console.log('enviando: ', solicitud);
    const body = JSON.stringify(solicitud);
    return this._http.post(
      this.url + '/api/solicitudes/guardar/viste_mi_solicitud', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
  /**
   * Funcion para obtener el numero de publicaciones permitidas
   * @param publicacion
   * @author Omar
   */
  obtenerNumeroPublicacionesSolicitud(id_persona): Observable<any>{
    const body = JSON.stringify({'id_persona':id_persona});
    return this._http.post(
      this.url + '/api/solicitudes/obtener/numero_publicaciones', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
    /**
   * Servicio para dejar de publicar una promocion
   * @param publicacion
   * @author Omar
   */
  quitarPublicacionSolicitud(variable: SolicitudesModel) {
    const body = JSON.stringify(variable);
    return this._http.post(
      this.url + '/api/solicitudes/eliminar/publicacion', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
    /**
   * Funcion para obtener las Solicitudes publicadas
   * @author Omar
   */
  buscarSolicitudesPublicadas(): Observable<any> {
    return this._http.post(
      this.url + '/api/solicitudes/buscar/publicadas', {},
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
    /**
   * Funcion para obtener los dias para publicacion
   * @param id_proveedor
   */
  obtenerDiasPublicacionesSolicitud(id_proveedor): Observable<any>{
    const body = JSON.stringify({'id_proveedor':id_proveedor});
    return this._http.post(
      this.url + '/api/solicitudes/obtener/dias_publicaciones', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  /**
   * Servicio para obtener las plantillas
   * @author Omar
   */
  obtenerPlantillasSolicitudes(): Observable<any>{
    return this._http.post(
      this.url + '/api/solicitudes/obtener/plantillas', {},
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
    /**
   * Funcion para obtener las promociones publicadas
   * @author Omar
   */
  obtenerSolcitudesPublicadas(solicitud: SolicitudesModel): Observable<any> {
    const body = JSON.stringify(solicitud);
    return this._http.post(
      this.url + '/api/solicitudes/obtener/publicadas', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
   /**
   * Funcion para buscar las promociones publicadas
   * @author Omar
   */
  buscarSolicitudesPublicadasModulo(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({filtros: filtros});
    return this._http.post(
      this.url + '/api/solicitudes/buscar/publicadas', body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(res => {
      let jsOrigen: any;
      jsOrigen = res;

      const jsCategoria = new Array();
      let categoria = {
        id_categoria_negocio: undefined,
        nombre: undefined,
        id_giro: undefined,
        solicitudes: []
      };
      let solicitud = {
        short: undefined
      };

      if (jsOrigen.data !== undefined && jsOrigen.data !== null) {
        let idCategoriaActual: number;
        const totalDatos = jsOrigen.data.length;
        let iterador = 0;
        jsOrigen.data.forEach(it => {

          if (idCategoriaActual !== Number(it.id_categoria_negocio)) {

            if (iterador > 0) {
              jsCategoria.push(categoria);
            }

            idCategoriaActual = Number(it.id_categoria_negocio);

            categoria = {
              id_categoria_negocio: it.id_categoria_negocio,
              nombre: it.categoria_negocio,
              id_giro: it.id_giro,
              solicitudes: []
            };

          }

          solicitud = it;

          categoria.solicitudes.push(solicitud);

          if (iterador + 1 >= totalDatos) {
            jsCategoria.push(categoria);
          }

          iterador++;
        });
      }

      jsOrigen.data = jsCategoria;

      return jsOrigen;
    }));
  }
  /**
   * Funcion para buscar las promociones publicadas
   * @author Omar
   */
  obtenerSolicitudesPublicadas(filtros: FiltrosModel): Observable<any> {
    const body = JSON.stringify({filtros: filtros});
    return this._http.post(
      this.url + '/api/solicitudes/buscar/publicadas', body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
  /**
   * Servicio para dejar de publicar una publicacion
   * @param publicacion
   * @author Omar
   */
  quitarPublicacion(variable: SolicitudesModel) {
    const body = JSON.stringify(variable);
    return this._http.post(
      this.url + '/api/solicitudes/dejar/publicar', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
   /**
   * Servicio para guardar la postulacion
   * @param descripcion
   * @param archivo
   */
  enviarPostulacion(postulacion: PostulacionModel): Observable<any> {
    const body = JSON.stringify(postulacion);
    return this._http.post(
      this.url + '/api/solicitudes/guardar/postulacion', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {

      return data;
    }));
  }
  /**
   * Funcion para obtener detalle de los postulados
   * @param id_solicitud
   * @author Omar
   */
  obtenerPostulados(idSolicitud): Observable<any>{
    const body = JSON.stringify({'id_solicitud': idSolicitud});
    return this._http.post(
      this.url + '/api/solicitudes/obtener/postulados', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
  
  /**
   * Funcion para checkear postulacion
   * @param id_solicitud
   * @author Omar
   */
  checkendPostulacion(postulado: PostuladosModel): Observable<any>{
    const body = JSON.stringify(postulado);
    return this._http.post(
      this.url + '/api/solicitudes/guardar/checkend', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(data => {
      return data;
    }));
  }
}
