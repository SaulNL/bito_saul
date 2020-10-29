import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisNegociosPageRoutingModule } from './mis-negocios-routing.module';

import { MisNegociosPage } from './mis-negocios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisNegociosPageRoutingModule
  ],
  declarations: [MisNegociosPage]
})
export class MisNegociosPageModule {}
