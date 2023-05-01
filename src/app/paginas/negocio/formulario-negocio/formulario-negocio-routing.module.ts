import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormularioNegocioPage } from "./formulario-negocio.page";

const routes: Routes = [
  {
    path: "",
    component: FormularioNegocioPage
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormularioNegocioPageRoutingModule { }
