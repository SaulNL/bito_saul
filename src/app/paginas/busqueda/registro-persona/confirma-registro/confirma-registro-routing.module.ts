import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmaRegistroPage } from './confirma-registro.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmaRegistroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmaRegistroPageRoutingModule {}
