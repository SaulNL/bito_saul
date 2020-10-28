import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatTipoVentaPageRoutingModule } from './cat-tipo-venta-routing.module';

import { CatTipoVentaPage } from './cat-tipo-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatTipoVentaPageRoutingModule
  ],
  declarations: [CatTipoVentaPage]
})
export class CatTipoVentaPageModule {}
