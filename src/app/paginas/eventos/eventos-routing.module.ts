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
    path: 'mis-reservaciones',
    loadChildren: () => import('./mis-reservaciones/mis-reservaciones.module').then( m => m.MisReservacionesPageModule)
  },
  {
    path: 'calendario-reservacion',
    loadChildren: () => import('./calendario-reservacion/calendario-reservacion.module').then( m => m.CalendarioReservacionPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosPageRoutingModule {}
