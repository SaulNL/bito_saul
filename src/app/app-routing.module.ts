import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./paginas/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./paginas/categorias/categorias.module').then(m => m.CategoriasPageModule)
  },
  {
    path: 'actualizar-version',
    loadChildren: () => import('./paginas/actualizar-version/actualizar-version.module').then(m => m.ActualizarVersionPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
