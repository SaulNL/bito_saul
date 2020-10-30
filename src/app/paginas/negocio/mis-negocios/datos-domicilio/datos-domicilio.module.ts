import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosDomicilioPageRoutingModule } from './datos-domicilio-routing.module';

import { DatosDomicilioPage } from './datos-domicilio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosDomicilioPageRoutingModule
  ],
  declarations: [DatosDomicilioPage]
})
export class DatosDomicilioPageModule {}
