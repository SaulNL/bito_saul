import { IonicModule } from '@ionic/angular';
import { SliderImagesComponent } from './../components/slider-images/slider-images.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [SliderImagesComponent],
  imports: [CommonModule, IonicModule], exports: [SliderImagesComponent]
})
export class SliderImagesModule { }
