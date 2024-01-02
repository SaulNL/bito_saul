import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaReservacionExperienciasPageRoutingModule } from './lista-reservacion-experiencias-routing.module';

import { ListaReservacionExperienciasPage } from './lista-reservacion-experiencias.page';
import {SpinnerModule} from "../../../componentes/spinner/spinner.module";
import {TabsPageModule} from "../../tabs/tabs.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ListaReservacionExperienciasPageRoutingModule,
        SpinnerModule,
        TabsPageModule
    ],
  declarations: [ListaReservacionExperienciasPage]
})
export class ListaReservacionExperienciasPageModule {}
