import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilNegocioPage } from './perfil-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilNegocioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilNegocioPageRoutingModule {}
