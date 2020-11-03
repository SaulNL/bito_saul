import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewQrPageRoutingModule } from './view-qr-routing.module';

import { ViewQrPage } from './view-qr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewQrPageRoutingModule
  ],
  declarations: [ViewQrPage]
})
export class ViewQrPageModule {}
