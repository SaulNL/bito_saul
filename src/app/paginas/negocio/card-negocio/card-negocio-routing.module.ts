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
    loadChildren: () => import('./../formulario-negocio/formulario-negocio.module').then(m => m.FormularioNegocioPageModule)
  },
  {
    path: 'mis-productos-servicios',
    loadChildren: () => import('./../mis-productos-servicios/mis-productos-servicios.module').then(m => m.MisProductosServiciosPageModule)
  },
  {
    path: 'mis-contenidos',
    loadChildren: () => import('./../mis-contenidos/mis-contenidos.module').then( m => m.MisContenidosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardNegocioPageRoutingModule { }
