import { CommonFormsComponentsModule } from './../../module/common-forms-components.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentsModule } from '../../module/common-components.module';
import { RecoverPasswordComponent } from '../recover-password/recover-password.component';


@NgModule({
  declarations: [RecoverPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonComponentsModule,
    CommonFormsComponentsModule
  ]
})
export class RecoverPasswordModule { }
