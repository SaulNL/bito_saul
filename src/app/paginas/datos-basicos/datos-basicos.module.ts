import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosBasicosPageRoutingModule } from './datos-basicos-routing.module';

import { DatosBasicosPage } from './datos-basicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosBasicosPageRoutingModule
  ],
  declarations: [DatosBasicosPage]
})
export class DatosBasicosPageModule {}
