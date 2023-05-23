import { SolicitarCambioUrlComponent } from './../../../componentes/solicitar-cambio-url/solicitar-cambio-url.component';
import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormularioNegocioPageRoutingModule } from './formulario-negocio-routing.module';

import { FormularioNegocioPage } from './formulario-negocio.page';
import {TabsPageModule} from '../../tabs/tabs.module';
import {MisProductosServiciosPageModule} from '../mis-productos-servicios/mis-productos-servicios.module';
import { VigenciaPdfDistintivosComponent } from 'src/app/components/vigencia-pdf-distintivos/vigencia-pdf-distintivos.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FormularioNegocioPageRoutingModule,
        TabsPageModule,
        SpinnerModule,
        MisProductosServiciosPageModule
    ],
  declarations: [FormularioNegocioPage, SolicitarCambioUrlComponent, VigenciaPdfDistintivosComponent]
})
export class FormularioNegocioPageModule {}
