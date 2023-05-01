import { RecoverPasswordModule } from './../../components/recover-password/recover-password.module';
import { SignInOrUpSocialNetworksModule } from './../../components/sign-in-or-up-social-networks/sign-in-or-up-social-networks.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignInPageRoutingModule } from './sign-in-routing.module';
import { SignInPage } from './sign-in.page';
import { CommonComponentsModule } from '../../module/common-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignInPageRoutingModule,
    CommonComponentsModule,
    SignInOrUpSocialNetworksModule,
    RecoverPasswordModule
  ],
  declarations: [SignInPage]
})
export class SignInPageModule {}
