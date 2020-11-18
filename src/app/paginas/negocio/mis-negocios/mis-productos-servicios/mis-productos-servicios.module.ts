import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MisProductosServiciosPageRoutingModule } from './mis-productos-servicios-routing.module';
import { MisProductosServiciosPage } from './mis-productos-servicios.page';
import { TabsPageModule } from '../../../../paginas/tabs/tabs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisProductosServiciosPageRoutingModule,
    TabsPageModule
  ],
  declarations: [
    MisProductosServiciosPage
  ]
})
export class MisProductosServiciosPageModule {}
