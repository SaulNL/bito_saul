import { SpinnerModule } from './../../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoNegocioPageRoutingModule } from './info-negocio-routing.module';

import { InfoNegocioPage } from './info-negocio.page';
import { TabsPageModule } from '../../../../paginas/tabs/tabs.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoNegocioPageRoutingModule,
    TabsPageModule,
    SpinnerModule
  ],
  declarations: [InfoNegocioPage]
})
export class InfoNegocioPageModule {}
