import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'perfil',
        loadChildren: () => import('../../ajustes/ajustes.module').then(m => m.AjustesPageModule)
      },
      {
        path: 'cat-variable',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-variable/cat-variable.module').then( m => m.CatVariablePageModule)
      },
      {
        path: 'cat-organizaciones',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-organizacion/cat-organizacion.module').then( m => m.CatOrganizacionPageModule)
      },
      {
        path: 'datos-cat-variables',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-variable/datos-cat-variables/datos-cat-variables.module').then( m => m.DatosCatVariablesPageModule)
      },
      {
        path: 'cat-categoria',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-categoria/cat-categoria.module').then( m => m.CatCategoriaPageModule)
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
