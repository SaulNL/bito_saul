import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosProductosServiciosPage } from './datos-productos-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: DatosProductosServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosProductosServiciosPageRoutingModule {}
