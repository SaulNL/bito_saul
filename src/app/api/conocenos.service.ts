import { Injectable } from '@angular/core';
import {AppSettings} from "../AppSettings";
import {Observable, from} from "rxjs";
import {map} from "rxjs/operators";
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class ConocenosService {

  constructor(
      private http: HTTP
  ) {
  }

  url = `${AppSettings.API_ENDPOINT}`;
  
  Imagenes(): Observable<any> {
    const body = JSON.stringify({});
    return from(this.http.post( this.url + 'api/conocenos/list-public',body,
    AppSettings.getHeadersToken())
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
