import { SignInOrUpSocialNetworksComponent } from './sign-in-or-up-social-networks.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [SignInOrUpSocialNetworksComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [SignInOrUpSocialNetworksComponent]
})
export class SignInOrUpSocialNetworksModule { }
