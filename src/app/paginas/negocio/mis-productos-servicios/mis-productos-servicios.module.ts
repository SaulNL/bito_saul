import { TabsPageModule } from './../../tabs/tabs.module';
import { CargarImagenesSlideModule } from './../../../componentes/cargar-imagenes-slide/cargar-imagenes-slide.module';
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
    MisProductosServiciosPageRoutingModule,
    TabsPageModule,
    CargarImagenesSlideModule
  ],
  declarations: [
    MisProductosServiciosPage
  ]
})
export class MisProductosServiciosPageModule {}
