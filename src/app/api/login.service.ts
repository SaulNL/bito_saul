import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppSettings } from "../AppSettings";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url: string;
  constructor(
    private http: HTTP
  ) {
    this.url = AppSettings.API_ENDPOINT;
  }

  login(data_login): Observable<any> {
    const body = JSON.stringify(data_login);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/usr/login', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }

  resetPassword(correo: string): Observable<any> {
    const body = JSON.stringify({ 'correo': correo });
    this.http.setDataSerializer("utf8");
    let datos = from(this.http.post(this.url + 'api/usr/perfil/resetPassword', body,
      AppSettings.getHeaders())
      .then(data => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
    return datos.pipe(map(data => {
      return data;
    }));
  }

  validateLogin(data_login): Observable<any> {
    const body = JSON.stringify(data_login);
    this.http.setDataSerializer("utf8");
    return from(this.http.post(this.url + 'api/usr/login', body,
      AppSettings.getHeaders())
      .then((data) => {
        return JSON.parse(data.data);
      })
      .catch((error) => {
        return error;
      }));
  }
}
