import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatVariablePageRoutingModule } from './cat-variable-routing.module';

import { CatVariablePage } from './cat-variable.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatVariablePageRoutingModule
  ],
  declarations: [CatVariablePage]
})
export class CatVariablePageModule {}
