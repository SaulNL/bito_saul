import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardNegocioPage } from './card-negocio.page';

const routes: Routes = [
  {
    path: '',
    component: CardNegocioPage
  },
  {
    path: 'formulario-negocio',
    loadChildren: () => import('./../mis-negocios/formulario-negocio/formulario-negocio.module').then(m => m.FormularioNegocioPageModule )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardNegocioPageRoutingModule {}
