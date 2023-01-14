import { AppSettings } from './../AppSettings';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeneralServicesService {
  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient,
    private http: HTTP
  ) {
    this.http.setDataSerializer("utf8");
  }

  public getEstadosWS(): Observable<any> {
    const body = JSON.stringify({});
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/catalogo/estado/list`, body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  public getMunicipios(id_estado: number): Observable<any> {
    const body = JSON.stringify({ id_estado: id_estado, conNegocios:1 });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/catalogo/municipio/list`, body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  public getMunicipiosAll(id_estado: number): Observable<any> {
    const body = JSON.stringify({ id_estado: id_estado});
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/catalogo/municipio/list`, body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  public getLocalidad(id_municipio: number): Observable<any> {
    const body = JSON.stringify({ id_municipio: id_municipio, conNegocios:1 });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/catalogo/localidad/list`, body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  public getLocalidadAll(id_municipio: number): Observable<any> {
    const body = JSON.stringify({ id_municipio: id_municipio });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/catalogo/localidad/list`, body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  /**
   * Funcion para enviar el comentario por correo
   * @param datos
   * @author Omar
   */
  enviarComentarioCorreo(datos: any): Observable<any> {
    const body = JSON.stringify(datos);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/comentario/enviar`, body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
    // return this._http.post(
    //   `${this.url}api/comentario/enviar`,
    //   body,
    //   {headers: AppSettings.getHeaders()}
    // ).pipe(map(data => {
    //   return data;
    // }));
  }
  /**
 * Servicio para obtener la lista de de negocios por id's
 */
  public obtenerNegocios(ids: any): Observable<any> {
    const body = JSON.stringify({ id_negocios: ids });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(`${this.url}api/servicio/lista/mapaNegocios`, body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
 /**
   * Servicio listado de negocios VIP
   */
  obtenerPrincipalVip(): Observable<any> {
    const body = JSON.stringify({});
    this.http.setDataSerializer('utf8');
    return from(this.http.post(
        this.url + 'api/negocios/vip/obtener',
        body,  AppSettings.getHeaders())
        .then((data) => {
          console.log("NEGOCIOS VIP: " + JSON.stringify(data.data));
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

    this.http.setDataSerializer("utf8");
    return from(this.http.post(
      this.url + 'api/catalogo/tiempoTemporizador',
      body, AppSettings.getHeaders())
      .then((data) => {

        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerListaCategopriasProducto(id: any, tipo: number): Observable<any> {
    const body = JSON.stringify({ id_categoria_negocio: id, tipo: tipo });

    this.http.setDataSerializer("utf8");
    return from(this.http.post(
      this.url + 'api/buscar/categorias/producto',
      body, AppSettings.getHeadersToken())
      .then((data) => {

        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerOrganizacionesPorUsuario(idUsuario: number): Observable<any> {
    const body = JSON.stringify({ id_persona: idUsuario });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(
      this.url + 'api/catalogo/organizaciones/obtenerPorUsuario',
      body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerOrganizaciones(idUsuario , idProveedor): Observable<any> {
    this.http.setDataSerializer("utf8");
    const body = JSON.stringify({id_usuario:idUsuario,id_proveedor:idProveedor});
    return from(this.http.post(
      this.url + 'api/catalogo/organizaciones/obtenerTodasActivasUsuario',
      body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  obtenerPlazas(): Observable<any> {
    this.http.setDataSerializer("utf8");
    const body = JSON.stringify({});
    return from(this.http.post(
      this.url + 'api/catalogo/plazas/obtenerPlazas',
      body, AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  features(idNegocio: number):Observable<any>{
    const body = JSON.stringify({"id" : idNegocio});
    this.http.setDataSerializer('utf8');
    return from(this.http.post(`${this.url}api/buscar/caracteristicasnegocio`, body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }
}
