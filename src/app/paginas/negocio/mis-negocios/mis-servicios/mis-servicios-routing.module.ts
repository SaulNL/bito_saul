import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisServiciosPage } from './mis-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: MisServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisServiciosPageRoutingModule {}
