import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatSubcategoriaPage } from './cat-subcategoria.page';

const routes: Routes = [
  {
    path: '',
    component: CatSubcategoriaPage
  },
  {
    path: 'datos-subcategoria',
    loadChildren: () => import('./datos-subcategoria/datos-subcategoria.module').then( m => m.DatosSubcategoriaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatSubcategoriaPageRoutingModule {}
