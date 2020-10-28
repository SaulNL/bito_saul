import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatVariablePage } from './cat-variable.page';

const routes: Routes = [
  {
    path: '',
    component: CatVariablePage
  },
  {
    path: 'datos-cat-variables',
    loadChildren: () => import('./datos-cat-variables/datos-cat-variables.module').then( m => m.DatosCatVariablesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatVariablePageRoutingModule {}
