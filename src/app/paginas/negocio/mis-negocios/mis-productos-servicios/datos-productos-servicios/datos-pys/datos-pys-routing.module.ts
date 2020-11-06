import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPysPage } from './datos-pys.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPysPageRoutingModule {}
