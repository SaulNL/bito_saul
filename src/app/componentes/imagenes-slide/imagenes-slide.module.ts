import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ImagenesSlideComponent } from './imagenes-slide.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [ImagenesSlideComponent],
  imports: [
    CommonModule, FormsModule, IonicModule
  ], exports: [ImagenesSlideComponent]
})
export class ImagenesSlideModule { }
