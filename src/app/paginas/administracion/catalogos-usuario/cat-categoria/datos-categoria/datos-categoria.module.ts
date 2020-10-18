import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosCategoriaPageRoutingModule } from './datos-categoria-routing.module';

import { DatosCategoriaPage } from './datos-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosCategoriaPageRoutingModule
  ],
  declarations: [DatosCategoriaPage]
})
export class DatosCategoriaPageModule {}
