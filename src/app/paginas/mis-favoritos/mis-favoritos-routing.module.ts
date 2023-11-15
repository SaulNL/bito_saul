import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisFavoritosPage } from './mis-favoritos.page';

const routes: Routes = [
  {
    path: '',
    component: MisFavoritosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisFavoritosPageRoutingModule {}
