import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from "../../../api/auth-guard.service";
import { DashboardPage } from './dashboard.page';

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
