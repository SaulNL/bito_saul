import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaUsuarioPageRoutingModule } from './agenda-usuario-routing.module';

import { AgendaUsuarioPage } from './agenda-usuario.page';
import {CalendarioAgendasPageModule} from "../calendario-agendas/calendario-agendas.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AgendaUsuarioPageRoutingModule,
        CalendarioAgendasPageModule
    ],
  declarations: [AgendaUsuarioPage]
})
export class AgendaUsuarioPageModule {}
