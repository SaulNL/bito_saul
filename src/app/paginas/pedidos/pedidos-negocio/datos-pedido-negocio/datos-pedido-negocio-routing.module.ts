import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPedidoNegocioPage } from './datos-pedido-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPedidoNegocioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPedidoNegocioPageRoutingModule {}
