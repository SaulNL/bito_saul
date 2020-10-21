import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosCatRolPageRoutingModule } from './datos-cat-rol-routing.module';

import { DatosCatRolPage } from './datos-cat-rol.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosCatRolPageRoutingModule
  ],
  declarations: [DatosCatRolPage]
})
export class DatosCatRolPageModule {}
