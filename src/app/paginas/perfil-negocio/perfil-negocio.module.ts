import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilNegocioPageRoutingModule } from './perfil-negocio-routing.module';

import { PerfilNegocioPage } from './perfil-negocio.page';
import { CalificarNegocioComponent } from '../../componentes/calificar-negocio/calificar-negocio.component';
import {DetalleProductoComponent} from "../../componentes/detalle-producto/detalle-producto.component";
import {PedidoNegocioComponent} from "../../componentes/pedido-negocio/pedido-negocio.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilNegocioPageRoutingModule
  ],
  declarations: [PerfilNegocioPage, CalificarNegocioComponent, DetalleProductoComponent, PedidoNegocioComponent ]
})
export class PerfilNegocioPageModule {}
