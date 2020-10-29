import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPedidoDialogPage } from './datos-pedido-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPedidoDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPedidoDialogPageRoutingModule {}
