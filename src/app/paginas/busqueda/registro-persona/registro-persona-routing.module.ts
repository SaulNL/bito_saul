import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroPersonaPage } from './registro-persona.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroPersonaPage
  },
  {
    path: 'confirma-registro',
    loadChildren: () => import('./confirma-registro/confirma-registro.module').then( m => m.ConfirmaRegistroPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroPersonaPageRoutingModule {}
