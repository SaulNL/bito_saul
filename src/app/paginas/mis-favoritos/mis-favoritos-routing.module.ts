import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisFavoritosPage } from './mis-favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: MisFavoritosPage
  },
  {
    path: 'productos-favoritos',
    loadChildren: () => import('./productos-favoritos/productos-favoritos.module').then( m => m.ProductosFavoritosPageModule)
  },
  {
    path: 'negocios-favoritos',
    loadChildren: () => import('./negocios-favoritos/negocios-favoritos.module').then( m => m.NegociosFavoritosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisFavoritosPageRoutingModule {}
