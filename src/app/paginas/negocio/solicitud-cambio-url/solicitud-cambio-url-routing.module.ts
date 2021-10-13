import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudCambioUrlPage } from './solicitud-cambio-url.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudCambioUrlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudCambioUrlPageRoutingModule {}
