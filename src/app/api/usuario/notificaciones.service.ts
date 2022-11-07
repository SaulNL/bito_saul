import { AppSettings } from "../../AppSettings";
import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: "root",
})

export class NotificacionesService {
    url = `${AppSettings.API_ENDPOINT}`;
    constructor(private http: HTTP) { }
  
    /**
     * Servicio para obtener las notificaciones del usuario
     * @author Silver
     */
     obtenerNotificaciones(idProveedor: number): Observable<any> {
        const body = JSON.stringify({id_proveedor: idProveedor});
        this.http.setDataSerializer("utf8");
            return from(this.http.post(this.url + 'api/proveedor/obtener/notificaciones', body,            
            AppSettings.getHeadersToken())
            .then((data) => {
            return JSON.parse(data.data);
          })
          .catch((error) => {
            return error;
          }));
        }        
  }