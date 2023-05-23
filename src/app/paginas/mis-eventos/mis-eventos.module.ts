import { ModalEventosPageModule } from './modal-eventos/modal-eventos.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisEventosPageRoutingModule } from './mis-eventos-routing.module';

import { MisEventosPage } from './mis-eventos.page';
import { ModalEventosPage } from './modal-eventos/modal-eventos.page';
import { SpinnerModule } from '../../componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisEventosPageRoutingModule,
    SpinnerModule
  ],
  declarations: [MisEventosPage,]
})
export class MisEventosPageModule { }
