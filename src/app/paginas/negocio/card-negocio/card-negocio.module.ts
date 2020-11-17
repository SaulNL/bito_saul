import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardNegocioPageRoutingModule } from './card-negocio-routing.module';

import { CardNegocioPage } from './card-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardNegocioPageRoutingModule
  ],
  declarations: [CardNegocioPage]
})
export class CardNegocioPageModule {}
