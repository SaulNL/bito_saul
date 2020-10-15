import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosCatVariablesPageRoutingModule } from './datos-cat-variables-routing.module';

import { DatosCatVariablesPage } from './datos-cat-variables.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosCatVariablesPageRoutingModule
  ],
  declarations: [DatosCatVariablesPage]
})
export class DatosCatVariablesPageModule {}
