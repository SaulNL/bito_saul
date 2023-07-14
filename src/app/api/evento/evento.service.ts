import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../../AppSettings';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(
    private http: HttpClient,
    private _http: HTTP
  ) { }

  tipoEvento(): Observable<any> {
    let body = "";
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/tiposEvento/obtenerTodosActivos', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
  tipoRecurrencia(): Observable<any> {
    let body = "";
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/tiposRecurrencia/obtenerTodosActivos', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
  eventoInfo(id): Observable<any> {
    let body = JSON.stringify(id);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/obtenerEvento', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
  guardarEvento(data): Observable<any> {
    let body = JSON.stringify(data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/guardar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
  obtenerEvento(id): Observable<any> {
    let body = JSON.stringify(id);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/persona', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }

  obtenerReservaciones(idEvento: any): Observable<any>{
    const aux = {
      "id_evento": idEvento
    };
    const body = JSON.stringify(aux);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/listaReservaciones', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
    }));

  }

  confirmarReservacion(aux){
    const body = JSON.stringify(aux);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/confirmar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
    }));
  }
  eliminarEvento(id): Observable<any> {
    let body = JSON.stringify(id);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/eliminar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
}
