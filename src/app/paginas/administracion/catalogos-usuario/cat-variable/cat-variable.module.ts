import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatVariablePageRoutingModule } from './cat-variable-routing.module';

import { DatosCatVariablesPage } from './datos-cat-variables/datos-cat-variables.page';

import { CatVariablePage } from './cat-variable.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatVariablePageRoutingModule
  ],
  declarations: [
    CatVariablePage,
    DatosCatVariablesPage
  ]
})
export class CatVariablePageModule {}
