import { SpinnerModule } from './../../componentes/spinner/spinner.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {UtilsCls} from "../../utils/UtilsCls";
import { RecuperarContraseniaPage } from './recuperar-contrasenia/recuperar-contrasenia.page';
import {LoginSocialNetworksComponent} from "../../componentes/login-social-networks/login-social-networks.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SpinnerModule
  ],
    declarations: [LoginPage, RecuperarContraseniaPage, LoginSocialNetworksComponent],
  providers:[SideBarService,UtilsCls]
})
export class LoginPageModule {}
