import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPopoverPage } from './datos-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPopoverPageRoutingModule {}
