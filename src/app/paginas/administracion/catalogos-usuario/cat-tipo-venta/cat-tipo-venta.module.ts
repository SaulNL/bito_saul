import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatTipoVentaPageRoutingModule } from './cat-tipo-venta-routing.module';

import { DatosCatTipoVentasPage } from "./datos-cat-tipo-ventas/datos-cat-tipo-ventas.page";

import { CatTipoVentaPage } from './cat-tipo-venta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatTipoVentaPageRoutingModule
  ],
  declarations: [
  CatTipoVentaPage,
  DatosCatTipoVentasPage]
})
export class CatTipoVentaPageModule {}
