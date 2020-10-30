import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisProductosServiciosPageRoutingModule } from './mis-productos-servicios-routing.module';

import { MisProductosServiciosPage } from './mis-productos-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisProductosServiciosPageRoutingModule
  ],
  declarations: [MisProductosServiciosPage]
})
export class MisProductosServiciosPageModule {}
