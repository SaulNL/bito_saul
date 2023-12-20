import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../AppSettings';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienciasTuristicasService {
  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private http: HttpClient,
    private _http: HTTP
  ) { }

  tipoRecurrencia(): Observable<any> {
    let body = "";
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/tiposRecurrencia/obtenerTodosActivos', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
  guardarExperiencia(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/guardar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
}
