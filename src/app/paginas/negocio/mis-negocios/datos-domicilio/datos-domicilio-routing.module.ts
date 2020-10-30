import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosDomicilioPage } from './datos-domicilio.page';

const routes: Routes = [
  {
    path: '',
    component: DatosDomicilioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosDomicilioPageRoutingModule {}
