import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosComplementariosPage } from './datos-complementarios.page';

const routes: Routes = [
  {
    path: '',
    component: DatosComplementariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosComplementariosPageRoutingModule {}
