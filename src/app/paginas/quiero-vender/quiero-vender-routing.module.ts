import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuieroVenderPage } from './quiero-vender.page';

const routes: Routes = [
  {
    path: '',
    component: QuieroVenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuieroVenderPageRoutingModule {}
