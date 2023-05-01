import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MisProductosServiciosPage } from './mis-productos-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: MisProductosServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisProductosServiciosPageRoutingModule {}
