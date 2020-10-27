import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardAdminSolicitudPage } from './card-admin-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: CardAdminSolicitudPage
  },
  {
    path: 'solicitud-postulados',
    loadChildren: () => import('./solicitud-postulados/solicitud-postulados.module').then( m => m.SolicitudPostuladosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardAdminSolicitudPageRoutingModule {}
