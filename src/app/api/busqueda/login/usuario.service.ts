import { AppSettings } from '../../../AppSettings';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { UsuarioSistemaModel } from 'src/app/Modelos/UsuarioSistemaModel';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(
    private _http: HttpClient
  ) { }

    /**
   * Servicio para obtener el codigo de seguridad (por seguridad solo el id)
   * @param numeroCelular
   * @author Omar
   */
  public obtenerCodigoSMS(numeroCelular): Observable<any>{
    const body = JSON.stringify({numero: numeroCelular});
    return this._http.post(
      `${this.url}api/proveedoresUsuario/obtener/codigo`, body,
      { headers: AppSettings.getHeaders() }
    ).pipe(map(data => {
      return data;
    }));
  }
  create_account_admin_salon(register_usuario: UsuarioSistemaModel): Observable<any> {
    const body = JSON.stringify(register_usuario);
    return this._http.post(
      `${this.url}api/proveedoresUsuario/guardarUsuario`, body,
      { headers: AppSettings.getHeaders() }
    ).pipe(map(data => {
      return data;
    }));
  }
}
