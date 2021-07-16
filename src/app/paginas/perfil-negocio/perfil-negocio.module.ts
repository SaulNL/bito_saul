import { DetalleProductoModule } from './../../componentes/detalle-producto/detalle-producto.module';
import { DarLikeProductoModule } from './../../componentes/dar-like-producto/dar-like-producto.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilNegocioPageRoutingModule } from './perfil-negocio-routing.module';

import { PerfilNegocioPage } from './perfil-negocio.page';
import { CalificarNegocioComponent } from '../../componentes/calificar-negocio/calificar-negocio.component';
// import {DetalleProductoComponent} from "../../componentes/detalle-producto/detalle-producto.component";
import {PedidoNegocioComponent} from "../../componentes/pedido-negocio/pedido-negocio.component";
import {ComentariosNegocioComponent} from '../../componentes/comentarios-negocio/comentarios-negocio.component';
import {DarLikeNegocioModule} from '../../componentes/dar-like-negocio/dar-like-negocio.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PerfilNegocioPageRoutingModule,
        DarLikeProductoModule,
        DetalleProductoModule,
        DarLikeNegocioModule
    ],
  declarations: [PerfilNegocioPage, CalificarNegocioComponent,  PedidoNegocioComponent, ComentariosNegocioComponent ]
})
export class PerfilNegocioPageModule {}
