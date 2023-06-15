import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisReservacionesPage } from './mis-reservaciones.page';

const routes: Routes = [
  {
    path: '',
    component: MisReservacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisReservacionesPageRoutingModule {}
