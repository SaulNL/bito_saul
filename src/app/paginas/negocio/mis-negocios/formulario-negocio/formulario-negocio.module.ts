import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioNegocioPageRoutingModule } from './formulario-negocio-routing.module';

import { FormularioNegocioPage } from './formulario-negocio.page';
import {TabsPageModule} from '../../../tabs/tabs.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FormularioNegocioPageRoutingModule,
        TabsPageModule
    ],
  declarations: [FormularioNegocioPage]
})
export class FormularioNegocioPageModule {}
