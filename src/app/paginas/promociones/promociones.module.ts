import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromocionesPage } from './promociones.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { Tab2PageRoutingModule } from './promociones-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule
  ],
  declarations: [PromocionesPage]
})
export class Tab2PageModule {}
