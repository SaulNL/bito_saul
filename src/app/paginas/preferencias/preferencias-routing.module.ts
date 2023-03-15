import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreferenciasPage } from './preferencias.page';

const routes: Routes = [
  {
    path: '',
    component: PreferenciasPage
  },/*{
    path: 'preferencias',
    loadChildren: () => import('./preferencias.module').then( m => m.PreferenciasPageModule)
  }*/

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreferenciasPageRoutingModule {}
