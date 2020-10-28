import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatOrganizacionPage } from './cat-organizacion.page';

const routes: Routes = [
  {
    path: '',
    component: CatOrganizacionPage
  },
  {
    path: 'datos-cat-organizacion',
    loadChildren: () => import('./datos-cat-organizacion/datos-cat-organizacion.module').then( m => m.DatosCatOrganizacionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatOrganizacionPageRoutingModule {}
