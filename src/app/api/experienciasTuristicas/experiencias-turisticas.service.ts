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

  obtenerExperienciasPersona(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/persona', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }

  eliminarExperiencia(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/eliminar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }

  activarDesactivarExperiencia(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/activarDesactivar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }

  reservacionesExperiencias(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/listaReservaciones', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }

  visualiceExperiencia(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/visitas/experiencias/registrar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }

  reservarExperiencia(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/reservar', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
  reservacionesUsuario(Data): Observable<any> {
    let body = JSON.stringify(Data);
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/listaReservacionesUsuario', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
      .catch((error) => {
        return error;
      }));
  }
  
  experienciasLista(): Observable<any> {
    const body = JSON.stringify({});
    return from(this._http.post( this.url + 'api/experiencias/publicadas', body, AppSettings.getHeadersToken()).then( data => {
      return JSON.parse(data.data);
    }).catch((error) => {
      return error;
    }));
  }

  experienciaDetalle(id: any): Observable<any>{
    const body = JSON.stringify({id_experiencia_turistica: id});
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/experiencias/obtenerExperiencia', body, AppSettings.getHeadersToken()).then((data) => {
      return JSON.parse(data.data);
    })
        .catch((error) => {
          return error;
        }));
  }
}
