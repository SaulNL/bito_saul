import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatDenunciasNegocioPage } from './cat-denuncias-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: CatDenunciasNegocioPage
  },
  {
    path: 'datos-cat-denuncia',
    loadChildren: () => import('./datos-cat-denuncia/datos-cat-denuncia.module').then( m => m.DatosCatDenunciaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatDenunciasNegocioPageRoutingModule {}
