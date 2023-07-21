import { DenunciaNegocioPageModule } from './denuncia-negocio/denuncia-negocio.module';
import { PedidoNegocioModule } from '../../componentes/pedido-negocio/pedido-negocio.module';
import { CalificarNegocioModule } from '../../componentes/calificar-negocio/calificar-negocio.module';
import { SpinnerModule } from '../../componentes/spinner/spinner.module';
import { DetalleProductoModule } from '../../componentes/detalle-producto/detalle-producto.module';
import { DarLikeProductoModule } from '../../componentes/dar-like-producto/dar-like-producto.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PerfilNegocioPageRoutingModule } from './perfil-negocio-routing.module';
import { PerfilNegocioPage } from './perfil-negocio.page';
import { ComentariosNegocioComponent } from '../../componentes/comentarios-negocio/comentarios-negocio.component';
import { DarLikeNegocioModule } from '../../componentes/dar-like-negocio/dar-like-negocio.module';
import { MapaPerfilComponent } from './mapa-perfil/mapa-perfil.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilNegocioPageRoutingModule,
    DarLikeProductoModule,
    DetalleProductoModule,
    DarLikeNegocioModule,
    SpinnerModule,
    CalificarNegocioModule,
    PedidoNegocioModule,
    DenunciaNegocioPageModule
  ],
  providers: [
    InAppBrowser
  ],
  declarations: [PerfilNegocioPage, ComentariosNegocioComponent,
    MapaPerfilComponent]
})
export class PerfilNegocioPageModule { }
