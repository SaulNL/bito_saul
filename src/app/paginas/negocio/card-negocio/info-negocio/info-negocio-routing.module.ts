import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoNegocioPage } from './info-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: InfoNegocioPage
  },  {
    path: 'solicitud-cambio-url',
    loadChildren: () => import('./solicitud-cambio-url/solicitud-cambio-url.module').then( m => m.SolicitudCambioUrlPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoNegocioPageRoutingModule {}
