import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardAdminSolicitudPageRoutingModule } from './card-admin-solicitud-routing.module';

import { CardAdminSolicitudPage } from './card-admin-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardAdminSolicitudPageRoutingModule
  ],
  declarations: [CardAdminSolicitudPage]
})
export class CardAdminSolicitudPageModule {}
