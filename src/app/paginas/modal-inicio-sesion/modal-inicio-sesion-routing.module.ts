import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalInicioSesionPage } from './modal-inicio-sesion.page';

const routes: Routes = [
  {
    path: '',
    component: ModalInicioSesionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalInicioSesionPageRoutingModule {}
