import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatRolPage } from './cat-rol.page';

const routes: Routes = [
  {
    path: '',
    component: CatRolPage
  },
  {
    path: 'datos-cat-rol',
    loadChildren: () => import('./datos-cat-rol/datos-cat-rol.module').then( m => m.DatosCatRolPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatRolPageRoutingModule {}
