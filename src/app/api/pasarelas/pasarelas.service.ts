import { Injectable } from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {AppSettings} from '../../AppSettings';
import {map} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {INegocioBrokerAT} from '../../interfaces/pasarelas/INegocioBrokerAT';

@Injectable({
  providedIn: 'root'
})
export class PasarelasService {

  constructor(
      private http: HTTP
  ) {
  }

  url = `${AppSettings.API_ENDPOINT}`;


  guardar(parametros): Observable<any> {
    const body = JSON.stringify(parametros);
    return from(this.http.post(
        this.url + 'api/brokers/mercadoPago/agregarAT', body,
         AppSettings.getHeadersToken()
    ).then( r => {
      return r.data;
    }));
  }

  obtenerAT(parametros): Observable<any> {
    const body = JSON.stringify(parametros);
    return from(this.http.post(
        this.url + 'api/brokers/mercadoPago/obtenerAT', body,
        AppSettings.getHeadersToken()
    ).then( r => {
      return r.data;
    }));
  }


  pedidoOrdenMP(data): Observable<any>{
    const body = JSON.stringify(data);
    return from(this.http.post(
        this.url + 'api/brokers/mercadoPago/ordenPago', body,
        AppSettings.getHeadersToken()
    ).then( r => {
      return r.data;
    }));
  }
}
