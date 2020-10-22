import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosAvisosInformacionPage } from './datos-avisos-informacion.page';

const routes: Routes = [
  {
    path: '',
    component: DatosAvisosInformacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosAvisosInformacionPageRoutingModule {}
