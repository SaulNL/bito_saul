import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPalabraReservadasPage } from './datos-palabra-reservadas.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPalabraReservadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPalabraReservadasPageRoutingModule {}
