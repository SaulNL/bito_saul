import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosNegocioPage } from './pedidos-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosNegocioPage
  },
  {
    path: 'datos-pedido-negocio',
    loadChildren: () => import('./datos-pedido-negocio/datos-pedido-negocio.module').then( m => m.DatosPedidoNegocioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosNegocioPageRoutingModule {}
