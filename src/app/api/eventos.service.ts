import { Injectable } from '@angular/core';
import {AppSettings} from '../AppSettings';
import {from, Observable} from 'rxjs';
import {HTTP} from '@ionic-native/http/ngx';
import {FiltroEventosModel} from '../Modelos/FiltroEventosModel';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
      private _http: HTTP
  ) { }

  url = `${AppSettings.API_ENDPOINT}`;

  eventosLista(){
    const body = '';
    this._http.setDataSerializer('utf8');
    return from(this._http.post(this.url + 'api/eventos/publicados', body, AppSettings.getHeaders()).then((data) => {
      return JSON.parse(data.data);
    })
        .catch((error) => {
          return error;
        }));
  }

  eventoDetalle(id: any): Observable<any>{
      const body = JSON.stringify({id_evento: id});
      this._http.setDataSerializer('utf8');
      return from(this._http.post(this.url + 'api/eventos/obtenerEvento', body, AppSettings.getHeadersToken()).then((data) => {
          return JSON.parse(data.data);
      })
          .catch((error) => {
              return error;
          }));
  }

  realizarReservacion(filtro: any): Observable<any>{
      // tslint:disable-next-line:max-line-length
      const body = JSON.stringify({id_evento: filtro[0], id_persona: filtro[1], fc_evento_reservacion: filtro[2], cantidad_persona: filtro[3]});
      this._http.setDataSerializer('utf8');
      return from(this._http.post(this.url + 'api/eventos/reservar', body, AppSettings.getHeadersToken()).then((data) => {
          return JSON.parse(data.data);
      })
          .catch((error) => {
              return error;
          }));
  }

  buscarFiltroEvento(filtroEvento: FiltroEventosModel): Observable<any>{
      const body = JSON.stringify(filtroEvento);
      this._http.setDataSerializer('utf8');
      return from(this._http.post(this.url + 'api/eventos/publicados', body, AppSettings.getHeadersToken()).then((data) => {
              return JSON.parse(data.data);
          })
          .catch((error) => {
              return error;
          }));
  }


  recurrenciaLista(){
      const body = '';
      this._http.setDataSerializer('utf8');
      return from(this._http.post(this.url + 'api/eventos/tiposRecurrencia/obtenerTodosActivos', body, AppSettings.getHeadersToken()).then((data) => {
          return JSON.parse(data.data);
      })
          .catch((error) => {
              return error;
          }));
  }

  tipoEventoLista(){
      const body = '';
      this._http.setDataSerializer('utf8');
      return from(this._http.post(this.url + 'api/eventos/tiposEvento/obtenerTodosActivos', body, AppSettings.getHeadersToken()).then((data) => {
          return JSON.parse(data.data);
      })
          .catch((error) => {
              return error;
          }));
  }

  eventosMunicipios(idEstado: any): Observable<any> {
        const body = JSON.stringify({ id_estado: idEstado});
        this._http.setDataSerializer('utf8');
        return from(this._http.post(`${this.url}api/catalogo/municipio/list`, body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
  }

    eventosLocalidadAll(idMunicipio: number): Observable<any> {
        const body = JSON.stringify({ id_municipio: idMunicipio });
        this._http.setDataSerializer('utf8');
        return from(this._http.post(`${this.url}api/catalogo/localidad/list`, body, AppSettings.getHeaders())
            .then((data) => {
                return JSON.parse(data.data);
            })
            .catch((error) => {
                return error;
            }));
    }


}
