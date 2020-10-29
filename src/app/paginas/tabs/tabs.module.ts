import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { BannerPromocionesComponent } from '../../componentes/banner-promociones/banner-promociones.component';
import { ToolbarBusquedaComponent } from '../../componentes/toolbar-busqueda/toolbar-busqueda.component';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
  ],
  declarations: [
    TabsPage,
    BannerPromocionesComponent,
    ToolbarBusquedaComponent 
  ],
  exports: [
    BannerPromocionesComponent,
    ToolbarBusquedaComponent 
  ]
})
export class TabsPageModule {}
