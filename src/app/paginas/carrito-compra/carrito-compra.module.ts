import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritoCompraPageRoutingModule } from './carrito-compra-routing.module';

import { CarritoCompraPage } from './carrito-compra.page';
import { FormBuilder } from '@angular/forms';
import { PedidoNegocioModule } from '../../componentes/pedido-negocio/pedido-negocio.module';
import {SpinnerModule} from "../../componentes/spinner/spinner.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CarritoCompraPageRoutingModule,
        PedidoNegocioModule,
        SpinnerModule
    ],
  declarations: [CarritoCompraPage],
  providers: [FormBuilder]
})
export class CarritoCompraPageModule {}
