import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosPage } from './eventos.page';

const routes: Routes = [
  {
    path: '',
    component: EventosPage
  },
  {
    path: 'reservaciones/:id',
    loadChildren: () => import('./reservaciones/reservaciones.module').then( m => m.ReservacionesPageModule)
  },
  {
    path: 'generar-reservacion',
    loadChildren: () => import('./generar-reservacion/generar-reservacion.module').then( m => m.GenerarReservacionPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosPageRoutingModule {}
