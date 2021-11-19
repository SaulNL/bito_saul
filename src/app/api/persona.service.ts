import { Injectable } from '@angular/core';
import {AppSettings} from "../AppSettings";
import {HttpClient} from "@angular/common/http";
import {from, Observable} from "rxjs";
import { MsPersonaModel } from '../Modelos/MsPersonaModel';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(
    private _http: HTTP
  ) { }
  url = `${AppSettings.API_ENDPOINT}`;

  cambiarContrasenia(idUsuario: number, contrasenia: any): Observable<any> {
    const body = JSON.stringify({id_usuario: idUsuario, password: contrasenia.newContrasenia, passwordAct: contrasenia.contaseniaAtual});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + 'api/usr/password/edit', body, AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }
  guardar(busquedaTO: MsPersonaModel): Observable<any> {
    const body = JSON.stringify(busquedaTO);
    this._http.setDataSerializer("utf8");
    return from(this._http.post(this.url + 'api/proveedoresUsuario/guardarPersonaProveedor', body,AppSettings.getHeadersToken())
    .then((data) => {
      return JSON.parse(data.data);
    })
    .catch((error) => {
      return error;
    }));
  }
  datosUsuario(idPesona: number): Observable<any> {
    const body = JSON.stringify({id_persona : idPesona});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      this.url + 'api/proveedor/obtener-proveedor-id-persona', body,
       AppSettings.getHeadersToken())
       .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }


  obtenerProductosFavoritos(idPersona: number): Observable<any> {
    const body = JSON.stringify({id_persona : idPersona});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
        `${this.url}api/favoritos/productos`, body,
        AppSettings.getHeadersToken())
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        }));
  }

  obtenerNegociosFavoritos(idPersona: number): Observable<any> {
    const body = JSON.stringify({id_persona : idPersona});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
        `${this.url}api/usuario/favoritos/negocios`, body,
        AppSettings.getHeadersToken())
        .then((data) => {
          return JSON.parse(data.data);
        })
        .catch((error) => {
          return error;
        }));
  }

  datosBasicos(idPersona: number) {
    const body = JSON.stringify({id_persona : idPersona});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      `${this.url}api/personas/obtener/datosBasicos`, body,
        AppSettings.getHeaders()
    ).then(
      (data) => {
        return JSON.parse(data.data);
      }
    ).catch((error) => {
      return error;
    }));
  }

  datosComplementarios(idPersona: number) {
    const body = JSON.stringify({id_persona : idPersona});
    this._http.setDataSerializer("utf8");
    return from(this._http.post(
      `${this.url}api/personas/obtener/datosComplementarios`, body,
        AppSettings.getHeaders()
    ).then(
      (data) => {
        return JSON.parse(data.data);
      }
    ).catch((error) => {
      return error;
    }));
  }
}
