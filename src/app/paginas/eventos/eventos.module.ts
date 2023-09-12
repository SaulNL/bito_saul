import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventosPageRoutingModule } from './eventos-routing.module';

import { EventosPage } from './eventos.page';
import {SpinnerModule} from '../../componentes/spinner/spinner.module';
import {TabsPageModule} from "../tabs/tabs.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EventosPageRoutingModule,
        SpinnerModule,
        TabsPageModule
    ],
  declarations: [EventosPage]
})
export class EventosPageModule {}
