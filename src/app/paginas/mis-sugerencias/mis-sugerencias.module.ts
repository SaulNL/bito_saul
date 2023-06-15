import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowserModule } from '@angular/platform-browser';
import { PromocionInfoComponent } from './promocion-info/promocion-info.component';
import { ViewQrPromocionComponent } from 'src/app/components/viewqr-promocion/viewqr-promocion.component';
import { MisSugerenciasPageRoutingModule } from './mis-sugerencias-routing.module';
import { Tab2PageModule } from '../promociones/promociones.module';
import { MisSugerenciasPage } from './mis-sugerencias.page';
import { DarLikeNegocioModule } from '../../componentes/dar-like-negocio/dar-like-negocio.module';
import { SpinnerModule } from 'src/app/componentes/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisSugerenciasPageRoutingModule,
    DarLikeNegocioModule,
    Tab2PageModule,
    SpinnerModule
  ],
  declarations: [
    MisSugerenciasPage,
    PromocionInfoComponent,
  ]
})
export class MisSugerenciasModule { }
