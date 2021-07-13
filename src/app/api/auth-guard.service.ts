import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  public tf;
  public url;
  public objectof;
  constructor(private router: Router) {
    this.tf = true;
  }

  canActivate(route): boolean {
    

    if (this.tf === false) {
      let cancell = "true";
      let ruta = route._routerState.url;
      if (ruta==="/tabs/home/perfil?special=true") {
        ruta = "/tabs/home/perfil";
      }

      let all = '{"cancel":'+cancell+',"ruta":"'+ruta+'"}';

      this.router.navigate(["/tabs/negocio/" + this.url], {
        queryParams: { cancel: all },
      });
      return false;
    }
    return true;
  }
}
