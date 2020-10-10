import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosBasicosPage } from './datos-basicos.page';

const routes: Routes = [
  {
    path: '',
    component: DatosBasicosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosBasicosPageRoutingModule {}
