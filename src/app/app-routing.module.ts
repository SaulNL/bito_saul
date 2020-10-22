import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./paginas/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },  {
    path: 'categorias',
    loadChildren: () => import('./paginas/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'conocenos',
    loadChildren: () => import('./paginas/busqueda/busqueda/conocenos/conocenos.module').then( m => m.ConocenosPageModule)
  },
  {
    path: 'contacto',
    loadChildren: () => import('./paginas/busqueda/contacto/contacto.module').then( m => m.ContactoPageModule)
  },
  {
    path: 'footer',
    loadChildren: () => import('./paginas/busqueda/footer/footer.module').then( m => m.FooterPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
