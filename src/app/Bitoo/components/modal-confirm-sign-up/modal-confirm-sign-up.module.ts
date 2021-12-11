import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentsModule } from '../../module/common-components.module';
import { ModalConfirmSignUpComponent } from './modal-confirm-sign-up.component';

@NgModule({
  declarations: [ModalConfirmSignUpComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonComponentsModule
  ]
})
export class ModalConfirmSignUpModule { }
