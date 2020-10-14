import { Injectable } from '@angular/core';
import {AppSettings} from "../AppSettings";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { MsPersonaModel } from '../Modelos/MsPersonaModel';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(
    private http: HttpClient
  ) { }
  url = `${AppSettings.API_ENDPOINT}`;

  cambiarContrasenia(idUsuario: number, contrasenia: any): Observable<any> {
    const body = JSON.stringify({id_usuario: idUsuario, password: contrasenia.newContrasenia, passwordAct: contrasenia.contaseniaAtual});
    return this.http.post(
      this.url + 'api/usr/password/edit', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  guardar(busquedaTO: MsPersonaModel): Observable<any> {
    const body = JSON.stringify(busquedaTO);
    return this.http.post(
      this.url + 'api/proveedoresUsuario/guardarPersonaProveedor', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
  datosUsuario(idPesona: number): Observable<any> {
    const body = JSON.stringify({id_persona : idPesona});
    return this.http.post(
      this.url + 'api/proveedor/obtener-proveedor-id-persona', body,
      {headers: AppSettings.getHeadersToken()}
    ).pipe(map(res => {
      return res;
    }));
  }
}
