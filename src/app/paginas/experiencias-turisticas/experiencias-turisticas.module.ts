import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperienciasTuristicasPageRoutingModule } from './experiencias-turisticas-routing.module';

import { ExperienciasTuristicasPage } from './experiencias-turisticas.page';
import {SpinnerModule} from "../../componentes/spinner/spinner.module";
import {TabsPageModule} from "../tabs/tabs.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ExperienciasTuristicasPageRoutingModule,
        SpinnerModule,
        TabsPageModule
    ],
  declarations: [ExperienciasTuristicasPage]
})
export class ExperienciasTuristicasPageModule {}
