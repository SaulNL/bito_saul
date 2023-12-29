import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservacionExperienciaPageRoutingModule } from './reservacion-experiencia-routing.module';

import { ReservacionExperienciaPage } from './reservacion-experiencia.page';
import {SpinnerModule} from "../../../componentes/spinner/spinner.module";
import {CalendarioReservacionPageModule} from "../../eventos/calendario-reservacion/calendario-reservacion.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReservacionExperienciaPageRoutingModule,
        SpinnerModule,
        CalendarioReservacionPageModule
    ],
  declarations: [ReservacionExperienciaPage]
})
export class ReservacionExperienciaPageModule {}
