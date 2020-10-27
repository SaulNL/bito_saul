import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardSolicitudPageRoutingModule } from './card-solicitud-routing.module';

import { CardSolicitudPage } from './card-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardSolicitudPageRoutingModule
  ],
  declarations: [CardSolicitudPage]
})
export class CardSolicitudPageModule {}
