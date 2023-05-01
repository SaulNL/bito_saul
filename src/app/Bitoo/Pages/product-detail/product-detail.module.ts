import { LikeProductModule } from './../../components/like-product/like-product.module';
import { SliderImagesModule } from './../../module/slider-images.module';
import { CommonComponentsModule } from './../../module/common-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductDetailPageRoutingModule } from './product-detail-routing.module';
import { ProductDetailPage } from './product-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailPageRoutingModule,
    CommonComponentsModule,
    SliderImagesModule,
    LikeProductModule
  ],
  declarations: [ProductDetailPage]
})
export class ProductDetailPageModule {}
