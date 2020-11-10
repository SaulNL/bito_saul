import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardNegocioPage } from './card-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: CardNegocioPage
  },
  {
    path: 'info-negocio',
    loadChildren: () => import('./info-negocio/info-negocio.module').then( m => m.InfoNegocioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardNegocioPageRoutingModule {}
