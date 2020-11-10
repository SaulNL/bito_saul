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
  },
  {
    path: 'view-qr',
    loadChildren: () => import('./view-qr/view-qr.module').then( m => m.ViewQrPageModule)
  },  {
    path: 'card-negocio',
    loadChildren: () => import('./card-negocio/card-negocio.module').then( m => m.CardNegocioPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegocioPageRoutingModule {}
