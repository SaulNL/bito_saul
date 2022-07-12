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


  getDistanciaKmTiempo(origen: number, destino: number): Promise<any> {
    this.url = "http://maps.googleapis.com/maps/api/directions/json?sensor=false&mode=driving&origin="+origen+"&destination="+destino +"&key=AIzaSyCLHjwClODhVRMafZPm_Q1bNU83nH62hfY"
    return new Promise((resolve, reject) => {
      this.http.get(this.url)
        .subscribe((response: any) => {
          resolve(response);
        });
    });
   }

  // getDistanciaKmTiempo(origen: number, destino: number, legsCallback:Function){
  //   this.url = "http://maps.googleapis.com/maps/api/directions/json?sensor=false&mode=driving&origin="+origen+"&destination="+destino +"&key=AIzaSyCLHjwClODhVRMafZPm_Q1bNU83nH62hfY"
  //   this.http.get(this.url).subscribe(response =>{
  //     console.log(response);
  //     const responseResult:any = response; 
  //     if(responseResult.status == 'OK'){
  //       legsCallback(responseResult.routes[0].legs[0])
  //     }else{
  //       legsCallback(null);
  //     }
  //   },error=>{
  //     console.log(error);
  //     legsCallback(null);
  //   }) 
  // } 
}
