import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPedidoNegocioPageRoutingModule } from './datos-pedido-negocio-routing.module';

import { DatosPedidoNegocioPage } from './datos-pedido-negocio.page';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPedidoNegocioPageRoutingModule
  ],
  providers: [
    SocialSharing,
  ],
  declarations: [DatosPedidoNegocioPage]
})
export class DatosPedidoNegocioPageModule {}
