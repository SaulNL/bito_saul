import { SignInOrUpSocialNetworksModule } from './../../components/sign-in-or-up-social-networks/sign-in-or-up-social-networks.module';
import { ModalConfirmSignUpModule } from './../../components/modal-confirm-sign-up/modal-confirm-sign-up.module';
import { CommonFormsComponentsModule } from './../../module/common-forms-components.module';
import { CommonComponentsModule } from './../../module/common-components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignUpPageRoutingModule } from './sign-up-routing.module';
import { SignUpPage } from './sign-up.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpPageRoutingModule,
    CommonComponentsModule,
    CommonFormsComponentsModule,
    ModalConfirmSignUpModule,
    SignInOrUpSocialNetworksModule
  ],
  declarations: [SignUpPage]
})
export class SignUpPageModule {}
