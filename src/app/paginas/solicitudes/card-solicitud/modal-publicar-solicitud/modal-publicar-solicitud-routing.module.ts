import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPublicarSolicitudPage } from './modal-publicar-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPublicarSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPublicarSolicitudPageRoutingModule {}
