import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./paginas/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./paginas/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },  {
    path: 'mis-favoritos',
    loadChildren: () => import('./paginas/mis-favoritos/mis-favoritos.module').then( m => m.MisFavoritosPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
