import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisContenidosPage } from './mis-contenidos.page';

const routes: Routes = [
  {
    path: '',
    component: MisContenidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisContenidosPageRoutingModule {}
