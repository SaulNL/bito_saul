import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BotonTopComponent} from './boton-top.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';



@NgModule({
  declarations: [BotonTopComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [BotonTopComponent]
})
export class BotonTopModule { }
