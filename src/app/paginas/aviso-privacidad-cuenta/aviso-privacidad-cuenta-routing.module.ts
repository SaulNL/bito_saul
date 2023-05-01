import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvisoPrivacidadCuentaPage } from './aviso-privacidad-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: AvisoPrivacidadCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvisoPrivacidadCuentaPageRoutingModule {}
