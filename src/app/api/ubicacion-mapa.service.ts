import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { Observable } from "rxjs/internal/Observable";
import { from } from "rxjs/internal/observable/from";
import { map } from "rxjs/internal/operators/map";
import { AppSettings } from "../AppSettings";

@Injectable({
  providedIn: "root",
})
export class UbicacionMapa {
  public url;

  constructor(public http: HttpClient,  private _http: HTTP) {
    this.url = "";
  }
  getPosts(address: String) {
    this.url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      address +
      "&key=AIzaSyCLHjwClODhVRMafZPm_Q1bNU83nH62hfY";
    this.url = this.url.replace(" ", "%20").replace(",", "");
    return new Promise((resolve) => {
      this.http.get(this.url).subscribe(
        (data) => {
          resolve(data);
        },
        (error) => {}
      );
    }); 
    this.url = "";
  }

   getDistanciaKmTiempo(origen: number, destino: number) :Observable<any> {
      this.url ="https://maps.googleapis.com/maps/api/directions/json?sensor=false&mode=driving&origin="+origen+"&destination="+destino +"&key=AIzaSyCLHjwClODhVRMafZPm_Q1bNU83nH62hfY";
        this._http.setDataSerializer("utf8");
    return from(this._http.get( this.url,{}, AppSettings.getHeadersToken())
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
