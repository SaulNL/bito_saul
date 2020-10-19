import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosCatRolPage } from './datos-cat-rol.page';

const routes: Routes = [
  {
    path: '',
    component: DatosCatRolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosCatRolPageRoutingModule {}
