import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatTipoVentaPage } from './cat-tipo-venta.page';

const routes: Routes = [
  {
    path: '',
    component: CatTipoVentaPage
  },
  {
    path: 'datos-cat-tipo-ventas',
    loadChildren: () => import('./datos-cat-tipo-ventas/datos-cat-tipo-ventas.module').then( m => m.DatosCatTipoVentasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatTipoVentaPageRoutingModule {}
