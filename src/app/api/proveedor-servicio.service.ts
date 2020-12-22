import {Injectable} from '@angular/core';
import {Observable, from} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { AppSettings } from "../AppSettings";
import {FiltrosModel} from '../Modelos/FiltrosModel';
import {MsNegocioModel} from '../Modelos/busqueda/MsNegocioModel';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class ProveedorServicioService {

  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient,
    private http: HTTP
  ) {
  }

  obtenerCategoriasGiro(idGiro): Observable<any> {
    const body = JSON.stringify({id_giro: idGiro});
    this.http.setDataSerializer("utf8");
    let datos = from(this.http.post(`${this.url}/buscar/giro/categorias`,body,
    AppSettings.getHeaders())
    .then( data => {
        return JSON.parse(data.data);
    })
    .catch((error) => {
        return error;
    }));
    return datos.pipe(map(data => {
        return data;
    }));
  }

  public obtenerMiUbicacion(latitud, longitud): Observable<any> {
    const body = JSON.stringify({latitud, longitud});
    return this._http.post(
      `${this.url}api/proveedor/obtener/ubicacion`,
      body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }

}
