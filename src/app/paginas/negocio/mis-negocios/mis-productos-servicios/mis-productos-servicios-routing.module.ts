import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisProductosServiciosPage } from './mis-productos-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: MisProductosServiciosPage
  },
  {
    path: 'datos-productos-servicios',
    loadChildren: () => import('./datos-productos-servicios/datos-productos-servicios.module').then( m => m.DatosProductosServiciosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisProductosServiciosPageRoutingModule {}
