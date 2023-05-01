import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./paginas/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'pago-realizado',
    loadChildren: () => import('./paginas/pasarelas/pago-realizado/pago-realizado.module').then( m => m.PagoRealizadoPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
