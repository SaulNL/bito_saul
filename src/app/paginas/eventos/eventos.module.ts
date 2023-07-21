import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';
import {SpinnerModule} from '../../componentes/spinner/spinner.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EventosPageRoutingModule,
        SpinnerModule
    ],
  declarations: [EventosPage]
})
export class EventosPageModule {}
