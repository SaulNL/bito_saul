import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjustesPage } from './ajustes.page';

const routes: Routes = [
  {
    path: '',
    component: AjustesPage
  },
  {
    path: 'datos-basicos',
    loadChildren: () => import('../datos-basicos/datos-basicos.module').then(m => m.DatosBasicosPageModule)
  },
  {
    path: 'cambio-contrasenia',
    loadChildren: () => import('../cambio-contrasenia/cambio-contrasenia.module').then(m => m.CambioContraseniaPageModule)
  },
  {
    path: 'datos-complementarios',
    loadChildren: () => import('../datos-complementarios/datos-complementarios.module').then(m => m.DatosComplementariosPageModule)
  },
  {
    path: 'conocenos',
    loadChildren: () => import('../busqueda/busqueda/conocenos/conocenos.module').then(m => m.ConocenosPageModule)
  },
  {
    path: 'solicitudes',
    loadChildren: () => import('../solicitudes/solicitudes.module').then(m => m.SolicitudesPageModule)
  },
  {
    path: 'promociones',
    loadChildren: () => import('../mispromociones/mispromociones.module').then(m => m.MispromocionesPageModule)
  },
  {
    path: 'ventas',
    loadChildren: () => import('../pedidos/pedidos-negocio/pedidos-negocio.module').then(m => m.PedidosNegocioPageModule)
  },
  {
    path: 'compras',
    loadChildren: () => import('../pedidos/pedidos-dialog/pedidos-dialog.module').then(m => m.PedidosDialogPageModule)
  },
  {
    path: 'negocio',
    loadChildren: () => import('../../paginas/negocio/negocio.module').then(m => m.NegocioPageModule)
  },
  {
    path: 'ser-proveedor',
    loadChildren: () => import('../quiero-vender/quiero-vender.module').then(m => m.QuieroVenderPageModule)
  },
  {
    path: 'solicitud',
    loadChildren: () => import('../solicitud/solicitud.module').then(m => m.SolicitudPageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('../estadisticas/estadisticas.module').then(m => m.EstadisticasPageModule)
  },
  {
    path: 'preferencias',
    loadChildren: () => import('../preferencias/preferencias.module').then(m => m.PreferenciasPageModule)
  },
  {
    path: 'privacidad',
    loadChildren: () => import('../aviso-privacidad-cuenta/aviso-privacidad-cuenta.module').then(m => m.AvisoPrivacidadCuentaPageModule)
  },
  {
    path: 'agendaUsuario',
    loadChildren: () => import('../agenda-usuario/agenda-usuario.module').then(m => m.AgendaUsuarioPageModule)
  },
  {
    path: 'agendaNegocio',
    loadChildren: () => import('../agenda-negocio/agenda-negocio.module').then(m => m.AgendaNegocioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjustesPageRoutingModule { }
