import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'productos',
        loadChildren: () => import('../productos/productos.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'promociones',
        loadChildren: () => import('../promociones/promociones.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'inicio',
        loadChildren: () => import('../inicio/inicio.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'negocio/:negocio',
        loadChildren: () => import('../perfil-negocio/perfil-negocio.module').then(m => m.PerfilNegocioPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
