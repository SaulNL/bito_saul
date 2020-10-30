import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicarPromocionPageRoutingModule } from './publicar-promocion-routing.module';

import { PublicarPromocionPage } from './publicar-promocion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicarPromocionPageRoutingModule
  ],
  declarations: [PublicarPromocionPage]
})
export class PublicarPromocionPageModule {}
