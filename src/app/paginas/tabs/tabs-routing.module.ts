import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuardService } from '../../api/auth-guard.service';
import { GuardLoginService } from 'src/app/api/busqueda/guard-login.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'productos',
        loadChildren: () => import('../productos/productos.module').then(m => m.Tab1PageModule), canActivate: [AuthGuardService]
      },
      {
        path: 'mis-favoritos',
        loadChildren: () => import('../mis-favoritos/mis-favoritos.module').then(m => m.MisFavoritosPageModule)
      },
      {
        path: 'promociones',
        loadChildren: () => import('../promociones/promociones.module').then(m => m.Tab2PageModule), canActivate: [AuthGuardService]
      },
      {
        path: 'requerimientos',
        loadChildren: () => import('../solicitud/solicitud.module').then(m => m.SolicitudPageModule), canActivate: [AuthGuardService]
      },
      {
        path: 'inicio',
        loadChildren: () => import('../inicio/inicio.module').then(m => m.Tab3PageModule), canActivate: [AuthGuardService]
      },
      {
        path: 'categorias',
        loadChildren: () => import('../categorias/categorias.module').then(m => m.CategoriasPageModule), canActivate: [AuthGuardService]
      },
      {
        path: 'promocion/:id',
        loadChildren: () => import('../promocion/promocion.module').then( m => m.PromocionPageModule)
      },
      {
        path: 'negocio/:negocio',
        loadChildren: () => import('../perfil-negocio/perfil-negocio.module').then(m => m.PerfilNegocioPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../../Bitoo/Pages/sign-in/sign-in.module').then(m => m.SignInPageModule), canActivate: [GuardLoginService]
      },
      {
        path: 'actualizar-version',
        loadChildren: () => import('../actualizar-version/actualizar-version.module').then(m => m.ActualizarVersionPageModule)
      },
      {
        path: 'mis-sugerencias',
        loadChildren: () => import('../../paginas/mis-sugerencias/mis-sugerencias.module').then(m => m.MisSugerenciasModule)
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('../../paginas/notificacion/notificacion.module').then(m => m.NotificacionPageModule)
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
export class TabsPageRoutingModule { }
