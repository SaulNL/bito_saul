import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MispromocionesPage } from './mispromociones.page';

const routes: Routes = [
  {
    path: '',
    component: MispromocionesPage
  },  {
    path: 'agregar-promocion',
    loadChildren: () => import('./agregar-promocion/agregar-promocion.module').then( m => m.AgregarPromocionPageModule)
  },
  {
    path: 'publicar-promocion',
    loadChildren: () => import('./publicar-promocion/publicar-promocion.module').then( m => m.PublicarPromocionPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MispromocionesPageRoutingModule {}
