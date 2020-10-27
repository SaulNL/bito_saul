import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MispromocionesPage } from './mispromociones.page';

const routes: Routes = [
  {
    path: '',
    component: MispromocionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MispromocionesPageRoutingModule {}
