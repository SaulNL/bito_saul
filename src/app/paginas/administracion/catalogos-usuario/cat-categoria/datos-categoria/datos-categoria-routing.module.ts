import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosCategoriaPage } from './datos-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: DatosCategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosCategoriaPageRoutingModule {}
