import { LikeProductComponent } from './like-product.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [LikeProductComponent],
  imports: [CommonModule, IonicModule],
  exports: [LikeProductComponent]
})
export class LikeProductModule { }
