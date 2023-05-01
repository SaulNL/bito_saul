import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CargarImagenesSlideComponent } from './cargar-imagenes-slide.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [CargarImagenesSlideComponent],
  imports: [
    CommonModule, FormsModule, IonicModule
  ], exports : [CargarImagenesSlideComponent]
})
export class CargarImagenesSlideModule { }
