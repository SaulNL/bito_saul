import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaReservacionExperienciasPage } from './lista-reservacion-experiencias.page';

const routes: Routes = [
  {
    path: '',
    component: ListaReservacionExperienciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaReservacionExperienciasPageRoutingModule {}
