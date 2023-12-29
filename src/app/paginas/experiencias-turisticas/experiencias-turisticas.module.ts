import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperienciasTuristicasPageRoutingModule } from './experiencias-turisticas-routing.module';

import { ExperienciasTuristicasPage } from './experiencias-turisticas.page';
import {SpinnerModule} from "../../componentes/spinner/spinner.module";
import {TabsPageModule} from "../tabs/tabs.module";
import {ModalInicioSesionPageModule} from "../modal-inicio-sesion/modal-inicio-sesion.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ExperienciasTuristicasPageRoutingModule,
        SpinnerModule,
        TabsPageModule,
        ModalInicioSesionPageModule
    ],
  declarations: [ExperienciasTuristicasPage]
})
export class ExperienciasTuristicasPageModule {}
