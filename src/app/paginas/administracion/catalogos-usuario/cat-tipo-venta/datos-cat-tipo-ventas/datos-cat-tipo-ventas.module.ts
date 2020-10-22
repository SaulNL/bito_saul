import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosCatTipoVentasPageRoutingModule } from './datos-cat-tipo-ventas-routing.module';

import { DatosCatTipoVentasPage } from './datos-cat-tipo-ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosCatTipoVentasPageRoutingModule
  ],
  declarations: [DatosCatTipoVentasPage]
})
export class DatosCatTipoVentasPageModule {}
