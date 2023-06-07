import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarReservacionPage } from './generar-reservacion.page';

const routes: Routes = [
  {
    path: '',
    component: GenerarReservacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerarReservacionPageRoutingModule {}
