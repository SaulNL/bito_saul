import { Injectable } from '@angular/core';
import {AppSettings} from "../AppSettings";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
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
}
