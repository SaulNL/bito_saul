import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardPostuladoPage } from './card-postulado.page';

const routes: Routes = [
  {
    path: '',
    component: CardPostuladoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardPostuladoPageRoutingModule {}
