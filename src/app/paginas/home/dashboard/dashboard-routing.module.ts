import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'productos',
        loadChildren: () => import('../../productos/productos.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'cat-variable',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-variable/cat-variable.module').then( m => m.CatVariablePageModule)
      },
      {
        path: 'datos-cat-variables',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-variable/datos-cat-variables/datos-cat-variables.module').then( m => m.DatosCatVariablesPageModule)
      }
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/home/productos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
