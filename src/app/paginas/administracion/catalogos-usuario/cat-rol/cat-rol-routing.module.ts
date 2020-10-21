import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatRolPage } from './cat-rol.page';

const routes: Routes = [
  {
    path: '',
    component: CatRolPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatRolPageRoutingModule {}
