import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustesPage } from './ajustes.page';

const routes: Routes = [
  {
    path: '',
    component: AjustesPage
  },
  {
    path: 'datos-basicos',
    loadChildren: () => import('../datos-basicos/datos-basicos.module').then(m => m.DatosBasicosPageModule)
  },
  {
    path: 'cambio-contrasenia',
    loadChildren: () => import('../cambio-contrasenia/cambio-contrasenia.module').then(m => m.CambioContraseniaPageModule)
  },
  {
    path: 'datos-complementarios',
    loadChildren: () => import('../datos-complementarios/datos-complementarios.module').then(m => m.DatosComplementariosPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjustesPageRoutingModule { }
