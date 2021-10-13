import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { TabsPageModule } from './../../tabs/tabs.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormSolicitudPageRoutingModule } from './form-solicitud-routing.module';

import { FormSolicitudPage } from './form-solicitud.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormSolicitudPageRoutingModule,
    TabsPageModule,
    SpinnerModule
  ],
  declarations: [FormSolicitudPage]
})
export class FormSolicitudPageModule {}
