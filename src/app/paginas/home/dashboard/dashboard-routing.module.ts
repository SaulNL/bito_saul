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
        path: 'datos-cat-variables',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-variable/datos-cat-variables/datos-cat-variables.module').then( m => m.DatosCatVariablesPageModule)
      },
      {
        path: 'cat-rol',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-rol/cat-rol.module').then( m => m.CatRolPageModule)
      },
      {
        path: 'datos-cat-rol',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-rol/datos-cat-rol/datos-cat-rol.module').then( m => m.DatosCatRolPageModule)
      },
      {
        path: 'cat-palabra-reservadas',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-palabra-reservadas/cat-palabra-reservadas.module').then( m => m.CatPalabraReservadasPageModule)
      },
      {
        path: 'datos-palabra-reservadas',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-palabra-reservadas/datos-palabra-reservadas/datos-palabra-reservadas.module').then( m => m.DatosPalabraReservadasPageModule)
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
