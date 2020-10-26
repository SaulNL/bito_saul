import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { AppSettings } from "../AppSettings";
import {FiltrosModel} from '../Modelos/FiltrosModel';
import {MsNegocioModel} from '../Modelos/busqueda/MsNegocioModel';


@Injectable({
  providedIn: 'root'
})
export class ProveedorServicioService {

  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient
  ) {
  }

  obtenerCategoriasGiro(idGiro): Observable<any> {
    const body = JSON.stringify({id_giro: idGiro});
    return this._http.post(
      `${this.url}/buscar/giro/categorias`,
      body,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }

}
