import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioAgendasPageRoutingModule } from './calendario-agendas-routing.module';

import { CalendarioAgendasPage } from './calendario-agendas.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CalendarioAgendasPageRoutingModule
    ],
    exports: [
        CalendarioAgendasPage
    ],
    declarations: [CalendarioAgendasPage]
})
export class CalendarioAgendasPageModule {}
