import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosNegocioPageRoutingModule } from './pedidos-negocio-routing.module';

import { PedidosNegocioPage } from './pedidos-negocio.page';
import {DatosPedidoNegocioPage} from './datos-pedido-negocio/datos-pedido-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosNegocioPageRoutingModule
  ],
  declarations: [
    PedidosNegocioPage,
    DatosPedidoNegocioPage
  ]
})
export class PedidosNegocioPageModule {}
