import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExperienciasTuristicasPage } from './experiencias-turisticas.page';

const routes: Routes = [
  {
    path: '',
    component: ExperienciasTuristicasPage
  },
  {
    path: 'reservacion-experiencia/:id',
    loadChildren: () => import('./reservacion-experiencia/reservacion-experiencia.module').then( m => m.ReservacionExperienciaPageModule)
  },
  {
    path: 'lista-reservacion-experiencias',
    loadChildren: () => import('./lista-reservacion-experiencias/lista-reservacion-experiencias.module').then( m => m.ListaReservacionExperienciasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExperienciasTuristicasPageRoutingModule {}
