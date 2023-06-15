import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesReservacionPage } from './detalles-reservacion.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesReservacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesReservacionPageRoutingModule {}
