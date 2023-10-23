import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioReservacionPage } from './calendario-reservacion.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioReservacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioReservacionPageRoutingModule {}
