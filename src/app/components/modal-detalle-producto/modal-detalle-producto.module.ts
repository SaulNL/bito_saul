import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { ModalDetalleProductoComponent } from './modal-detalle-producto.component';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';
import { LikeProductModule } from 'src/app/Bitoo/components/like-product/like-product.module';
import { SliderImagesModule } from 'src/app/Bitoo/module/slider-images.module';
import { CommonComponentsModule } from 'src/app/Bitoo/module/common-components.module';
import { ProductDetailPageRoutingModule } from 'src/app/Bitoo/Pages/product-detail/product-detail-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowserModule,
    ProductDetailPageRoutingModule,
    CommonComponentsModule,
    SpinnerModule,
    SliderImagesModule,
    LikeProductModule
  ],
  declarations: []
})
export class ModalDetalleProductoModule {}