import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisEventosPage } from './mis-eventos.page';

const routes: Routes = [
  {
    path: '',
    component: MisEventosPage
  },
  {
    path: 'modal-eventos',
    loadChildren: () => import('./modal-eventos/modal-eventos.module').then( m => m.ModalEventosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisEventosPageRoutingModule {}
