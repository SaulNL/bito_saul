import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosDialogPage } from './pedidos-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosDialogPage
  },
  {
    path: 'datos-pedido-dialog',
    loadChildren: () => import('./datos-pedido-dialog/datos-pedido-dialog.module').then( m => m.DatosPedidoDialogPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosDialogPageRoutingModule {}
