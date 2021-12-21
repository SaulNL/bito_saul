import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticasPage } from './estadisticas.page';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasPage
  }, {
    path: 'statistics-by-business',
    loadChildren: () => import('../../Bitoo/Pages/statistics-by-business/statistics-by-business.module').then(m => m.StatisticsByBusinessPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadisticasPageRoutingModule { }
