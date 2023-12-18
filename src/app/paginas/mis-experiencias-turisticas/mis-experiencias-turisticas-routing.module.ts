import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisExperienciasTuristicasPage } from './mis-experiencias-turisticas.page';

const routes: Routes = [
  {
    path: '',
    component: MisExperienciasTuristicasPage
  },
  {
    path: 'fermulario-experiencias',
    loadChildren: () => import('./fermulario-experiencias/fermulario-experiencias.module').then( m => m.FermularioExperienciasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisExperienciasTuristicasPageRoutingModule {}
