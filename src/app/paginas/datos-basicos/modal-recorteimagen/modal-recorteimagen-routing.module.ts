import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalRecorteimagenPage } from './modal-recorteimagen.page';

const routes: Routes = [
  {
    path: '',
    component: ModalRecorteimagenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRecorteimagenPageRoutingModule {}
