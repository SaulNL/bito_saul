import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./paginas/tabs/tabs.module').then(m => m.TabsPageModule)
  },  {
    path: 'notificacion',
    loadChildren: () => import('./paginas/notificacion/notificacion.module').then( m => m.NotificacionPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
