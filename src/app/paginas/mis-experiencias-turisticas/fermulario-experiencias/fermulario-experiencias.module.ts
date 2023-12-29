import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FermularioExperienciasPageRoutingModule } from './fermulario-experiencias-routing.module';

import { FermularioExperienciasPage } from './fermulario-experiencias.page';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';
import { UbicacionFormularioComponent } from 'src/app/components/ubicacion-formulario/ubicacion-formulario.component';
import { TabsPageModule } from '../../tabs/tabs.module';
import { FormularioEtProductoComponent } from './formulario-et-producto/formulario-et-producto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FermularioExperienciasPageRoutingModule,
    ReactiveFormsModule,
    SpinnerModule,
    TabsPageModule,
  ],
  declarations: [
    FermularioExperienciasPage,
    FormularioEtProductoComponent,
  ]
    
})
export class FermularioExperienciasPageModule {}
