import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegociosFavoritosPage } from './negocios-favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: NegociosFavoritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegociosFavoritosPageRoutingModule {}
