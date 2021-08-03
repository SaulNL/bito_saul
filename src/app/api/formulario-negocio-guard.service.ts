import { NegocioService } from './negocio.service';
import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class FormularioNegocioGuard implements CanActivate {
  private rutaActual: any;
  private enterRuta: any;
  public activeForm: boolean;
  private content: any;
  private contenido: any;
  private posicion: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private negocio: NegocioService) {
    this.rutaActual = this.router.url;
    this.enterRuta = true;
    this.activeForm = true;
  }

  canActivate(route: any): boolean {
    console.log("Entro al can active");
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.special) {
        this.contenido = JSON.parse(params.special);
        this.negocio.buscarNegocio(this.contenido.id_negocio).subscribe(
          (response) => {
            this.content = response.data;
            console.log(this.content);

            const nuevaRuta = this.transformacionUrl(route._routerState.url);
            const rutaActual = this.transformacionUrl(this.rutaActual);
            console.log(this.rutaActual);
            console.log(nuevaRuta);
            console.log(rutaActual);
            console.log(this.content);
            if (rutaActual === "/tabs/home/negocio/card-negocio") {
              if (nuevaRuta === '/tabs/home/negocio/card-negocio/formulario-negocio/info-negocio') {
                this.irRuta(nuevaRuta, this.content);
              }
            } else {
              this.irRuta(rutaActual, this.content, nuevaRuta);
            }

          },
          (error) => {

          }
        );
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.navegation) {
        let nuevaRutaByForm = params.navegation;
        let rutaActualByForm = this.transformacionUrl(this.rutaActual);
        console.log(this.rutaActual);
        console.log(nuevaRutaByForm);
        console.log(rutaActualByForm);

        if (rutaActualByForm === "/tabs/home/negocio/card-negocio") {
          rutaActualByForm = '/tabs/home/negocio/card-negocio/formulario-negocio/info-negocio';
          if (nuevaRutaByForm === '/tabs/home/negocio/card-negocio/formulario-negocio/info-negocio') {
            this.irARutaX(nuevaRutaByForm);
          } else {
            this.irARutaX(rutaActualByForm, nuevaRutaByForm);
          }
        } else {
          this.irARutaX(rutaActualByForm, nuevaRutaByForm);
        }


      }
    });
    return this.activeForm;
  }
  private irRuta(actual: any, contenido: any, nueva: any = null) {
    if (typeof contenido !== 'undefined') {
      let negocioTO = JSON.parse(JSON.stringify(contenido));
      let all = {
        info: negocioTO,
        active: actual,
        nuevaUrl: nueva
      };
      let navigationExtras = JSON.stringify(all);
      this.router.navigate([actual], {
        queryParams: { rutaGuardian: navigationExtras },
      });
    }
  }

  private irARutaX(rutaA: any, nuevaR: any = null) {
    let all = {
      actual: rutaA,
      nueva: nuevaR
    };
    let navigationExtras = JSON.stringify(all);
    this.router.navigate([rutaA], {
      queryParams: { rutaUpdate: navigationExtras }
    });
  }

  private transformacionUrl(url: any) {
    const actualUrl = url;
    const posicion = url.indexOf("?special=");
    if (posicion > 0) {
      return url.slice(0, posicion);
    }
    return actualUrl;
  }

  private transformacionUrlUpdate(url: any) {
    const actualUrl = url;
    const posicion = url.indexOf("?navegation=");
    if (posicion > 0) {
      return url.slice(0, posicion);
    }
    return actualUrl;
  }
}
