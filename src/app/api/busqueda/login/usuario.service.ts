import { UserSignUpModel, CommonUserSingUpModel } from './../../../Bitoo/models/user-sign-up-model';
import { AppSettings } from "../../../AppSettings";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { UsuarioSistemaModel } from "src/app/Modelos/UsuarioSistemaModel";
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  url = `${AppSettings.API_ENDPOINT}`;
  constructor(private http: HTTP) { }

  /**
   * Servicio para obtener el codigo de seguridad (por seguridad solo el id)
   * @param numeroCelular
   * @author Omar
   */
  public obtenerCodigoSMS(numeroCelular, correo, medio): Observable<any> {
    const body = JSON.stringify({ numero: numeroCelular, correo: correo, medioEnvio: medio });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/obtener/codigo', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  public getCode(numeroCelular, correo, medio): Observable<any> {
    const body = JSON.stringify({ numero: numeroCelular, correo: correo, medioEnvio: medio });
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/obtener/codigo', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  createAccount(
    formSignUp: UserSignUpModel
  ): Observable<any> {
    const body = JSON.stringify(formSignUp);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuario', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  create_account_admin_salon(
    register_usuario: UsuarioSistemaModel
  ): Observable<any> {
    const body = JSON.stringify(register_usuario);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuario', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
  crearCuantaAdminGoogle(register_usuario): Observable<any> {
    const body = JSON.stringify(register_usuario);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuarioGoogle', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  crearCuantaAdminFacebook(register_usuario): Observable<any> {
    const body = JSON.stringify(register_usuario);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuarioFacebook', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  createAccountWithFacebook(user: CommonUserSingUpModel) {
    const body = JSON.stringify(user);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuarioFacebook', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  createAccountWithGoogle(user: CommonUserSingUpModel): Observable<any> {
    const body = JSON.stringify(user);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuarioGoogle', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  crearCuantaAdminApple(register_usuario): Observable<any> {
    const body = JSON.stringify(register_usuario);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuarioApple', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  createAccountApple(user: any): Observable<any> {
    const body = JSON.stringify(user);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/proveedoresUsuario/guardarUsuarioApple', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
}
