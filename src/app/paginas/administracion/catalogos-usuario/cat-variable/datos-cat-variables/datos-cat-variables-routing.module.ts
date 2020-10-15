import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosCatVariablesPage } from './datos-cat-variables.page';

const routes: Routes = [
  {
    path: '',
    component: DatosCatVariablesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosCatVariablesPageRoutingModule {}
