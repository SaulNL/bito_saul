import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisNegociosPage } from './mis-negocios.page';

const routes: Routes = [
  {
    path: '',
    component: MisNegociosPage
  },
  {
    path: 'informacion-negocio',
    loadChildren: () => import('./informacion-negocio/informacion-negocio.module').then( m => m.InformacionNegocioPageModule)
  },
  {
    path: 'mis-productos-servicios',
    loadChildren: () => import('./mis-productos-servicios/mis-productos-servicios.module').then( m => m.MisProductosServiciosPageModule)
  },
  {
    path: 'mis-servicios',
    loadChildren: () => import('./mis-servicios/mis-servicios.module').then( m => m.MisServiciosPageModule)
  },
  {
    path: 'formulario-negocio',
    loadChildren: () => import('./formulario-negocio/formulario-negocio.module').then( m => m.FormularioNegocioPageModule)
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisNegociosPageRoutingModule {}
