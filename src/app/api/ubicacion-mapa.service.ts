import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UbicacionMapa {
  public url;

  constructor(public http: HttpClient) {
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
}