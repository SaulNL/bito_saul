import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosSubcategoriaPage } from './datos-subcategoria.page';

const routes: Routes = [
  {
    path: '',
    component: DatosSubcategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosSubcategoriaPageRoutingModule {}
