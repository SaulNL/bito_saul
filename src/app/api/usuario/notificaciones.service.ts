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
 
  obtenerNotificaciones(id_proveedor: number, id_persona: number): Observable<any> { 
    const body = JSON.stringify({id_proveedor, id_persona});
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

  obtenerMensajesNotificacion(idRecibe: number, idEnvia: number, tipo: number): Observable<any> {
    
    const body = JSON.stringify(
      tipo === 1 ? { id_negocio_recibe: idRecibe, id_persona_envia: idEnvia } 
                 : { id_persona_recibe: idRecibe, id_negocio_envia: idEnvia }
                 );
    this.http.setDataSerializer("utf8");
    
    return from(this.http.post(this.url + 'api/mensajeria/obtener/mensajes', body, 
    AppSettings.getHeadersToken())
    .then((data) => { 
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }

  guardarMensajeNotificacion(json: any){
    const body = JSON.stringify(json);

    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/mensajeria/guardar/mensaje', body, AppSettings.getHeadersToken())
    .then((data) => { 
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));    
  }
     
  obtenerEncuestas(id_persona: number): Observable<any> {
    const body = JSON.stringify({id_persona: id_persona});
    this.http.setDataSerializer("utf8");

    return from(this.http.post(this.url + 'api/admin/catalogos/obtener/preguntasrapidasPendientesUsuario', body, 
    AppSettings.getHeadersToken())
    .then((data) => { 
      return JSON.parse(data.data);
    })
    .catch((error) => { 
      return error;
    }));
  }

  guardarRespuestaEncuesta(id_pregunta_rapida:number,id_persona:number,id_opcion_pregunta_rapida: number,fecha_respuestas:any){
  const body = JSON.stringify({id_pregunta_rapida:id_pregunta_rapida, id_persona: id_persona,
                               id_opcion_pregunta_rapida:id_opcion_pregunta_rapida, fecha_respuestas:fecha_respuestas});
  this.http.setDataSerializer("utf8");
      return from(this.http.post(this.url + 'api/admin/catalogos/guardar/preguntasrapidasUsuario', body,            
      AppSettings.getHeadersToken())
      .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }        
}