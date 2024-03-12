import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioAgendasPage } from './calendario-agendas.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarioAgendasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarioAgendasPageRoutingModule {}
