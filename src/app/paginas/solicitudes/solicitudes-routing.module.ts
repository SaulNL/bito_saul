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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesPageRoutingModule {}
