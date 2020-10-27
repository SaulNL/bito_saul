import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminSolicitudesPublicadasPage } from './admin-solicitudes-publicadas.page';

const routes: Routes = [
  {
    path: '',
    component: AdminSolicitudesPublicadasPage
  },
  {
    path: 'card-admin-solicitud',
    loadChildren: () => import('./card-admin-solicitud/card-admin-solicitud.module').then( m => m.CardAdminSolicitudPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminSolicitudesPublicadasPageRoutingModule {}
