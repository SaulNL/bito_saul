import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesPage } from './solicitudes.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesPage
  },
  {
    path: 'form-solicitud',
    loadChildren: () => import('./form-solicitud/form-solicitud.module').then( m => m.FormSolicitudPageModule)
  },  {
    path: 'card-solicitud',
    loadChildren: () => import('./card-solicitud/card-solicitud.module').then( m => m.CardSolicitudPageModule)
  },
  {
    path: 'admin-solicitudes-publicadas',
    loadChildren: () => import('./admin-solicitudes-publicadas/admin-solicitudes-publicadas.module').then( m => m.AdminSolicitudesPublicadasPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesPageRoutingModule {}
