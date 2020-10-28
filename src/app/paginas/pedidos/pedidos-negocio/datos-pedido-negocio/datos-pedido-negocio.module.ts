import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPedidoNegocioPageRoutingModule } from './datos-pedido-negocio-routing.module';

import { DatosPedidoNegocioPage } from './datos-pedido-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPedidoNegocioPageRoutingModule
  ],
  declarations: [DatosPedidoNegocioPage]
})
export class DatosPedidoNegocioPageModule {}
