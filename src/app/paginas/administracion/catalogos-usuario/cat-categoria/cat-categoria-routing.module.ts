import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatCategoriaPage } from './cat-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: CatCategoriaPage
  },
  {
    path: 'datos-categoria',
    loadChildren: () => import('./datos-categoria/datos-categoria.module').then( m => m.DatosCategoriaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatCategoriaPageRoutingModule {}
