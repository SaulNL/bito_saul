import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosCatTipoVentasPage } from './datos-cat-tipo-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: DatosCatTipoVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosCatTipoVentasPageRoutingModule {}
