import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DarLikeNegocioComponent } from './dar-like-negocio.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [DarLikeNegocioComponent],
  imports: [
    CommonModule, FormsModule, IonicModule
  ], exports : [
    DarLikeNegocioComponent
  ]

})
export class DarLikeNegocioModule { }
