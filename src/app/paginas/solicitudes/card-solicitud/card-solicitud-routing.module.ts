import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardSolicitudPage } from './card-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: CardSolicitudPage
  },
  {
    path: 'modal-publicar-solicitud',
    loadChildren: () => import('./modal-publicar-solicitud/modal-publicar-solicitud.module').then( m => m.ModalPublicarSolicitudPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardSolicitudPageRoutingModule {}
