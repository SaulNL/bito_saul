import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DenunciaNegocioPage } from './denuncia-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: DenunciaNegocioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DenunciaNegocioPageRoutingModule {}
