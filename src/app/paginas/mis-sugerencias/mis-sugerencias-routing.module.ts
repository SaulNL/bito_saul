import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisSugerenciasPage } from './mis-sugerencias.page';

const routes: Routes = [
  {
    path: '',
    component: MisSugerenciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisSugerenciasPageRoutingModule {}
