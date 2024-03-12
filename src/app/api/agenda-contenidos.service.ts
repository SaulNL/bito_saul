import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {AppSettings} from "../AppSettings";
import {map} from "rxjs/operators";
import {HTTP} from "@ionic-native/http/ngx";

@Injectable({
  providedIn: 'root'
})
export class AgendaContenidosService {
   private url: string;
  constructor(
      private http: HTTP

  ) {
      this.url = AppSettings.API_ENDPOINT;

  }

  obtenerAgendaServicioUsuario(idPersona: any): Observable<any> {
    const body = JSON.stringify({id_persona : idPersona});
    this.http.setDataSerializer("utf8");
    const datos = from(this.http.post(this.url + '/api/agendaServicios/listaAgendaServiciosUsuario', body,
        AppSettings.getHeadersToken())
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

    cambiarEstatusServicio(negocioAgenda: number, estatusAgenda: number): Observable<any> {
        const body = JSON.stringify({
            id_negocio_agenda : negocioAgenda,
            id_estatus_agenda : estatusAgenda
        });
        this.http.setDataSerializer("utf8");
        const datos = from(this.http.post(this.url + '/api/agendaServicios/cambiarEstatusAgendaServicio', body,
            AppSettings.getHeadersToken())
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
}

