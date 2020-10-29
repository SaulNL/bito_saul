import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPedidoDialogPageRoutingModule } from './datos-pedido-dialog-routing.module';

import { DatosPedidoDialogPage } from './datos-pedido-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPedidoDialogPageRoutingModule
  ],
  declarations: [DatosPedidoDialogPage]
})
export class DatosPedidoDialogPageModule {}
