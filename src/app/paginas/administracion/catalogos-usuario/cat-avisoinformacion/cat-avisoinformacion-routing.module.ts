import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatAvisoinformacionPage } from './cat-avisoinformacion.page';

const routes: Routes = [
  {
    path: '',
    component: CatAvisoinformacionPage
  },
  {
    path: 'datos-popover',
    loadChildren: () => import('./datos-popover/datos-popover.module').then( m => m.DatosPopoverPageModule)
  },
  {
    path: 'datos-avisos-informacion',
    loadChildren: () => import('./datos-avisos-informacion/datos-avisos-informacion.module').then( m => m.DatosAvisosInformacionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatAvisoinformacionPageRoutingModule {}
