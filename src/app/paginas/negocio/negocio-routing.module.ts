import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegocioPage } from './negocio.page';

const routes: Routes = [
  {
    path: '',
    component: NegocioPage
  },
  {
    path: 'mis-negocios',
    loadChildren: () => import('./mis-negocios/mis-negocios.module').then( m => m.MisNegociosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegocioPageRoutingModule {}
