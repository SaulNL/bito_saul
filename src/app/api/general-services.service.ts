import { AppSettings } from './../AppSettings';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {map} from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeneralServicesService {
  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient,
    private http: HTTP
  ) { }

  public getEstadosWS(): Observable<any> {
    return this._http.post(
      `${this.url}api/catalogo/estado/list`,
      {},
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
  public getMunicipios(id_estado: number): Observable<any> {
    const body = JSON.stringify({id_estado: id_estado});
    return this._http.post(
      `${this.url}api/catalogo/municipio/list`,
      body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {

      return data;
    }));
  }

  public getLocalidad(id_municipio: number): Observable<any> {
    const body = JSON.stringify({id_municipio: id_municipio});
    return this._http.post(
      `${this.url}api/catalogo/localidad/list`,
      body, {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {

      return data;
    }));
  }

  /**
   * Funcion para enviar el comentario por correo
   * @param datos
   * @author Omar
   */
  enviarComentarioCorreo(datos:any): Observable<any>{
    const body = JSON.stringify(datos);
    return this._http.post(
      `${this.url}api/comentario/enviar`,
      body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
    /**
   * Servicio para obtener la lista de de negocios por id's
   */
  public obtenerNegocios(ids: any): Observable<any> {
    const body = JSON.stringify({id_negocios: ids});    
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/servicio/lista/mapaNegocios`,body,AppSettings.getHeaders())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));  
  }
  
  /**
   * Servicio para obtener el tiempo de espera por sms
   */
  public obtenerTiempoTemporizador(): Observable<any> {
    const body = JSON.stringify({});
    console.log(body);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(
      this.url+'api/catalogo/tiempoTemporizador',
      body,AppSettings.getHeaders())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerListaCategopriasProducto(id: any, tipo: number): Observable<any> {
    const body = JSON.stringify({id_categoria_negocio: id, tipo: tipo});
    console.log(body);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(
      this.url+'api/buscar/categorias/producto',
      body,AppSettings.getHeadersToken())
      .then((data) => {
        console.log(data);
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
}
