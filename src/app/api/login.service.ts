import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../AppSettings";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url: string;
  constructor(
      private http: HttpClient
  ) {
    this.url = AppSettings.API_ENDPOINT;
  }

  login(data_login): Observable<any> {
    return this.http.post(
        this.url + 'api/usr/login',
        data_login,
        {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
  validateLogin(data_login): Observable<any> {
    return this.http.post(
      `${this.url}api/usr/login`,
      data_login,
      {headers: AppSettings.getHeaders()}
    ).pipe(map(data => {
      return data;
    }));
  }
}
