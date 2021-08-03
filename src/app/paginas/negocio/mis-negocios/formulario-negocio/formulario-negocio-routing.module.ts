import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormularioNegocioGuard } from "../../../../api/formulario-negocio-guard.service";
import { FormularioNegocioPage } from "./formulario-negocio.page";

const routes: Routes = [
  {
    path: "",
    component: FormularioNegocioPage,
    children: [
      {
        path: "info-negocio",
        loadChildren: () =>
          import("./../../card-negocio/info-negocio/info-negocio.module").then(
            (m) => m.InfoNegocioPageModule
          )
      },
      {
        path: "datos-contacto",
        loadChildren: () =>
          import("./../datos-contacto/datos-contacto.module").then(
            (m) => m.DatosContactoPageModule
          )
      },
      {
        path: "datos-domicilio",
        loadChildren: () =>
          import("./../datos-domicilio/datos-domicilio.module").then(
            (m) => m.DatosDomicilioPageModule
          )
      },
      {
        path: "formulario-negocio",
        redirectTo: "/tabs/home/negocio/card-negocio/formulario-negocio/info-negocio",
        pathMatch: "full",
      },
    ]
  },
  {
    path: 'formulario-negocio',
    redirectTo: '/tabs/home/negocio/card-negocio/formulario-negocio/info-negocio',
    pathMatch: 'full'
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioNegocioPageRoutingModule { }
