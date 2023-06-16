import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrokersPageRoutingModule } from './brokers-routing.module';

import { BrokersPage } from './brokers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrokersPageRoutingModule
  ],
  declarations: [BrokersPage],
  exports : [
  ]
})
export class BrokersPageModule {}
