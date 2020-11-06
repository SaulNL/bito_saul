import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewQrPage } from './view-qr.page';

const routes: Routes = [
  {
    path: '',
    component: ViewQrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewQrPageRoutingModule {}
