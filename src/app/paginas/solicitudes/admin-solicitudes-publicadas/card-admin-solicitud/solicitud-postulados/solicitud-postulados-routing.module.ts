import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudPostuladosPage } from './solicitud-postulados.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudPostuladosPage
  },
  {
    path: 'card-postulado',
    loadChildren: () => import('./card-postulado/card-postulado.module').then( m => m.CardPostuladoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudPostuladosPageRoutingModule {}
