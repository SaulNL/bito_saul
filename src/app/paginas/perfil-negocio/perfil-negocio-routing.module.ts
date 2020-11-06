import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilNegocioPage } from './perfil-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilNegocioPage
  },  {
    path: 'denuncia-negocio',
    loadChildren: () => import('./denuncia-negocio/denuncia-negocio.module').then( m => m.DenunciaNegocioPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilNegocioPageRoutingModule {}
