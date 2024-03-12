import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendaNegocioPage } from './agenda-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: AgendaNegocioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaNegocioPageRoutingModule {}
