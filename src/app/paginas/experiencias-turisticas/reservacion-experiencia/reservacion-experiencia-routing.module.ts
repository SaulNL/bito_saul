import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservacionExperienciaPage } from './reservacion-experiencia.page';

const routes: Routes = [
  {
    path: '',
    component: ReservacionExperienciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservacionExperienciaPageRoutingModule {}
