import { SpinnerModule } from './../../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DenunciaNegocioPageRoutingModule } from './denuncia-negocio-routing.module';
import { DenunciaNegocioPage } from './denuncia-negocio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DenunciaNegocioPageRoutingModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  declarations: [DenunciaNegocioPage]
})
export class DenunciaNegocioPageModule {}
