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


    obtenerAgendasNegocio(idNegocio: number): Observable<any> {
        const body = JSON.stringify({
            id_negocio : idNegocio
        });
        this.http.setDataSerializer("utf8");
        const datos = from(this.http.post(this.url + '/api/agendaServicios/listaAgendaServiciosNegocio', body,
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
    obtenerHorasDeAtencionNegocio(idNegocio: number, fechaServicio: any): Observable<any> {
        const body = JSON.stringify({
            id_negocio : idNegocio,
            fecha: fechaServicio
        });
        this.http.setDataSerializer("utf8");
        const datos = from(this.http.post(this.url + '/api/agendaServicios/listaHorasAgendaServiciosNegocio', body,
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
    obtenerModalidadAgendaServiciosNegocio(idNegocio: number): Observable<any> {
        const body = JSON.stringify({
            id_negocio : idNegocio,

        });
        this.http.setDataSerializer("utf8");
        const datos = from(this.http.post(this.url + '/api/agendaServicios/listaModalidadAgendaServiciosNegocio', body,
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


    agendarServicioUsuario(agenda: any): Observable<any> {
        console.log('esto recibe:', agenda);

        const body = JSON.stringify(agenda);
        this.http.setDataSerializer("utf8");
        const datos = from(this.http.post(this.url + '/api/agendaServicios/guardar', body,
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

