import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventosPage } from './eventos.page';

const routes: Routes = [
  {
    path: '',
    component: EventosPage
  },
  {
    path: 'reservaciones',
    loadChildren: () => import('./reservaciones/reservaciones.module').then( m => m.ReservacionesPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventosPageRoutingModule {}
