import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatPalabraReservadasPage } from './cat-palabra-reservadas.page';

const routes: Routes = [
  {
    path: '',
    component: CatPalabraReservadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatPalabraReservadasPageRoutingModule {}
