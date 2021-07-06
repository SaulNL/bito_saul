import { DarLikeProductoModule } from './../dar-like-producto/dar-like-producto.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DetalleProductoComponent } from './detalle-producto.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [DetalleProductoComponent],
  imports: [
    CommonModule, FormsModule, IonicModule, DarLikeProductoModule
  ], exports: [DetalleProductoComponent]
})
export class DetalleProductoModule { }
