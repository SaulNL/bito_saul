import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromocionesPage } from './promociones.page';

const routes: Routes = [
  {
    path: '',
    component: PromocionesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}
