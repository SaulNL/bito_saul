import { InputTagsComponent } from './../../../components/input-tags/input-tags.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEventosPageRoutingModule } from './modal-eventos-routing.module';

import { ModalEventosPage } from './modal-eventos.page';
import { TabsPageModule } from '../../tabs/tabs.module';
import { SpinnerModule } from '../../../componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEventosPageRoutingModule,
    TabsPageModule,
    SpinnerModule
  ],
  declarations: [ModalEventosPage]
})
export class ModalEventosPageModule { }
