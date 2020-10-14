import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioContraseniaPage } from './cambio-contrasenia.page';

const routes: Routes = [
  {
    path: '',
    component: CambioContraseniaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambioContraseniaPageRoutingModule {}
