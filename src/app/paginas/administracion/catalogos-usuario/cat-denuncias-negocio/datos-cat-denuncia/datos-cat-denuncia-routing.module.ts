import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosCatDenunciaPage } from './datos-cat-denuncia.page';

const routes: Routes = [
  {
    path: '',
    component: DatosCatDenunciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosCatDenunciaPageRoutingModule {}
