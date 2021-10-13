import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroPersonaPageRoutingModule } from './registro-persona-routing.module';

import { RegistroPersonaPage } from './registro-persona.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroPersonaPageRoutingModule,
    SpinnerModule
  ],
  declarations: [RegistroPersonaPage]
})
export class RegistroPersonaPageModule {}
