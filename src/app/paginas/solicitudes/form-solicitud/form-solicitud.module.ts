import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormSolicitudPageRoutingModule } from './form-solicitud-routing.module';

import { FormSolicitudPage } from './form-solicitud.page';
import { InputTagsComponent } from '../../../components/input-tags/input-tags.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormSolicitudPageRoutingModule
  ],
  declarations: [FormSolicitudPage, InputTagsComponent]
})
export class FormSolicitudPageModule {}
