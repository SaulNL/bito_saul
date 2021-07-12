import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "../../../api/auth-guard.service";
import { DashboardPage } from './dashboard.page';
import {MisFavoritosPageModule} from '../../mis-favoritos/mis-favoritos.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'perfil',
        loadChildren: () => import('../../ajustes/ajustes.module').then(m => m.AjustesPageModule) ,canActivate: [AuthGuardService]
      },
      {
        path: 'cat-variable',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-variable/cat-variable.module').then(m => m.CatVariablePageModule)
      },
      {
        path: 'cat-organizaciones',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-organizacion/cat-organizacion.module').then(m => m.CatOrganizacionPageModule)
      },
      {
        path: 'cat-avisos',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-avisoinformacion/cat-avisoinformacion.module').then( m => m.CatAvisoinformacionPageModule)
      },
      {
        path: 'cat-rol',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-rol/cat-rol.module').then( m => m.CatRolPageModule)
      },
      {
        path: 'cat-palabra-reservadas',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-palabra-reservadas/cat-palabra-reservadas.module').then( m => m.CatPalabraReservadasPageModule)
      },
      {
        path: 'cat-categoria',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-categoria/cat-categoria.module').then(m => m.CatCategoriaPageModule)
      },
      {
        path: 'cat-denuncias-negocio',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-denuncias-negocio/cat-denuncias-negocio.module').then(m => m.CatDenunciasNegocioPageModule)
      },
      {
        path: 'cat-tipo-venta',
        loadChildren: () => import('./../../administracion/catalogos-usuario/cat-tipo-venta/cat-tipo-venta.module').then(m => m.CatTipoVentaPageModule)
      },
      {
        path: 'conocenos',
        loadChildren: () => import('./../../busqueda/busqueda/conocenos/conocenos.module').then(m => m.ConocenosPageModule)
      },
      {
        path: 'solicitudes',
        loadChildren: () => import('./../../solicitudes/solicitudes.module').then(m => m.SolicitudesPageModule)
      },
      {
        path: 'promociones',
        loadChildren: () => import('./../../mispromociones/mispromociones.module').then(m => m.MispromocionesPageModule)
      },
      {
        path: 'ventas',
        loadChildren: () => import('../../pedidos/pedidos-negocio/pedidos-negocio.module').then(m => m.PedidosNegocioPageModule)
      },
      {
        path: 'compras',
        loadChildren: () => import('../../pedidos/pedidos-dialog/pedidos-dialog.module').then(m => m.PedidosDialogPageModule)
      },
      {
        path: 'negocio',
        loadChildren: () => import('./../../../paginas/negocio/negocio.module').then( m => m.NegocioPageModule)
      },
      {
        path: 'ser-proveedor',
        loadChildren: () => import('../../quiero-vender/quiero-vender.module').then(m => m.QuieroVenderPageModule)
      },
      {
        path: 'solicitud',
        loadChildren: () => import('../../solicitud/solicitud.module').then(m => m.SolicitudPageModule)
      },
      {
        path: 'mis-favoritos',
        loadChildren: () => import('../../mis-favoritos/mis-favoritos.module').then(m => m.MisFavoritosPageModule)
      },
      {
        path: 'estadisticas',
        loadChildren: () => import('../../estadisticas/estadisticas.module').then(m => m.EstadisticasPageModule)
      }

    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home/productos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule { }
