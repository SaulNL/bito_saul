import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualizarVersionPage } from './actualizar-version.page';

const routes: Routes = [
  {
    path: '',
    component: ActualizarVersionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualizarVersionPageRoutingModule {}
