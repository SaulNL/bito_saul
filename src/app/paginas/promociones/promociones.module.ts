import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesPage } from './promociones.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';



import { Tab2PageRoutingModule } from './promociones-routing.module';
import { TabsPageModule } from '../tabs/tabs.module';

/* Componentes */

import { PromocionComponent } from '../../components/promocion/promocion.component';
import { ModalPromocionComponent } from '../../components/modal-promocion/modal-promocion.component';
import { InfoPromoComponent } from '../../components/info-promo/info-promo.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    TabsPageModule
  ],
  declarations: [
    PromocionesPage,
    PromocionComponent,
    ModalPromocionComponent,
    InfoPromoComponent
  ]
})
export class Tab2PageModule {}
