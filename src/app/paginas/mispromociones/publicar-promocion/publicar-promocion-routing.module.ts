import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicarPromocionPage } from './publicar-promocion.page';

const routes: Routes = [
  {
    path: '',
    component: PublicarPromocionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicarPromocionPageRoutingModule {}
