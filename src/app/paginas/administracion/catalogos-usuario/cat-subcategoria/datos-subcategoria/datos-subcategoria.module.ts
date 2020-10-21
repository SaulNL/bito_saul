import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosSubcategoriaPageRoutingModule } from './datos-subcategoria-routing.module';

import { DatosSubcategoriaPage } from './datos-subcategoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosSubcategoriaPageRoutingModule
  ],
  declarations: [DatosSubcategoriaPage]
})
export class DatosSubcategoriaPageModule {}
