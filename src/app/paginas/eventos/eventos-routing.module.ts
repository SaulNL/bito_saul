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
  {
    path: 'mis-reservaciones',
    loadChildren: () => import('./mis-reservaciones/mis-reservaciones.module').then( m => m.MisReservacionesPageModule)
  },
  {
    path: 'detalles-reservacion',
    loadChildren: () => import('./detalles-reservacion/detalles-reservacion.module').then( m => m.DetallesReservacionPageModule)
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
