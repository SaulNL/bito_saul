import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisNegociosPage } from './mis-negocios.page';

const routes: Routes = [
  {
    path: '',
    component: MisNegociosPage
  },
  {
    path: 'informacion-negocio',
    loadChildren: () => import('./informacion-negocio/informacion-negocio.module').then( m => m.InformacionNegocioPageModule)
  },
  {
    path: 'datos-contacto',
    loadChildren: () => import('./datos-contacto/datos-contacto.module').then( m => m.DatosContactoPageModule)
  },
  {
    path: 'datos-domicilio',
    loadChildren: () => import('./datos-domicilio/datos-domicilio.module').then( m => m.DatosDomicilioPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./servicios/servicios.module').then( m => m.ServiciosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisNegociosPageRoutingModule {}
