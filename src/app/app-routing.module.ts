import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./paginas/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'modal-inicio-sesion',
    loadChildren: () => import('./paginas/modal-inicio-sesion/modal-inicio-sesion.module').then( m => m.ModalInicioSesionPageModule)
  },  {
    path: 'calendario-agendas',
    loadChildren: () => import('./paginas/calendario-agendas/calendario-agendas.module').then( m => m.CalendarioAgendasPageModule)
  }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
