import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosFavoritosPageRoutingModule } from './productos-favoritos-routing.module';

import { ProductosFavoritosPage } from './productos-favoritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosFavoritosPageRoutingModule
  ],
  declarations: [ProductosFavoritosPage]
})
export class ProductosFavoritosPageModule {}
