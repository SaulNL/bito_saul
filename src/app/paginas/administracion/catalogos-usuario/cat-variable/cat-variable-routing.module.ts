import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatVariablePage } from './cat-variable.page';

const routes: Routes = [
  {
    path: '',
    component: CatVariablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatVariablePageRoutingModule {}
