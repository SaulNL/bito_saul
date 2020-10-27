import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesPage } from './promociones.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { BannerPromocionesComponent } from '../../componentes/banner-promociones/banner-promociones.component';


import { Tab2PageRoutingModule } from './promociones-routing.module';

/* Componentes */

import { PromocionComponent } from '../../components/promocion/promocion.component';
import { ModalPromocionComponent } from '../../components/modal-promocion/modal-promocion.component';
import { InfoPromoComponent } from '../../components/info-promo/info-promo.component';
import { ToolbarBusquedaComponent } from '../../componentes/toolbar-busqueda/toolbar-busqueda.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
  ],
  declarations: [
    PromocionesPage,
    PromocionComponent,
    ModalPromocionComponent,
    InfoPromoComponent,
    BannerPromocionesComponent,
    ToolbarBusquedaComponent
  ]
})
export class Tab2PageModule {}
