import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosProductosServiciosPageRoutingModule } from './datos-productos-servicios-routing.module';

import { DatosProductosServiciosPage } from './datos-productos-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosProductosServiciosPageRoutingModule
  ],
  declarations: [DatosProductosServiciosPage]
})
export class DatosProductosServiciosPageModule {}
