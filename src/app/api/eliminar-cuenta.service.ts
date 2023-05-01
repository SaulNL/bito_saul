import { AppSettings } from './../AppSettings';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class EliminarCuentaService {

  url = `${AppSettings.API_ENDPOINT}`;

  constructor(
    private _http: HttpClient,
    private http: HTTP
  ) {
    this.http.setDataSerializer("utf8");
  }

  
  eliminarCuenta(idUsuario, idMotivo): Observable<any> {
    this.http.setDataSerializer("utf8");
    const body = JSON.stringify({id_usuario:idUsuario,id_motivo_eliminar_cuenta:idMotivo});
    return from(this.http.post(
      this.url + 'api/usuario/eliminarRegistro',
      body, AppSettings.getHeadersToken())
      .then((data) => {
        return JSON.parse(data.data);
        
      })
      .catch((error) => {
        return error;
      }));
  }

  motivoEliminarCuenta(): Observable<any> {
    this.http.setDataSerializer("utf8");
    return from(this.http.get( this.url + 'api/catalogo/motivoeliminarcuenta/list',{}, AppSettings.getHeadersToken())
        .then( data => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        })).pipe(map(data => {
      return data;
    }));
  }
  
}
