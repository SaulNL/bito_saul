import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatPalabraReservadasPage } from './cat-palabra-reservadas.page';

const routes: Routes = [
  {
    path: '',
    component: CatPalabraReservadasPage
  },
  {
    path: 'datos-palabra-reservadas',
    loadChildren: () => import('./datos-palabra-reservadas/datos-palabra-reservadas.module').then( m => m.DatosPalabraReservadasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatPalabraReservadasPageRoutingModule {}
