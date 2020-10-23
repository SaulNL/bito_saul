import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormSolicitudPage } from './form-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: FormSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormSolicitudPageRoutingModule {}
