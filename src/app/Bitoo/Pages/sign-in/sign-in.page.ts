import { SignInOrUpSocialNetworksComponent } from './../../components/sign-in-or-up-social-networks/sign-in-or-up-social-networks.component';
import { ResponderInterface } from './../../models/responder-model';
import { ContentCommonUserSingUpInterface } from './../../models/user-sign-up-model';
import { SelectedSocialNetwork } from './../../types/platform-type';
import { ProccessSignUp } from './../../helper/proccess-sign-up';
import { UsuarioService } from './../../../api/busqueda/login/usuario.service';
import { RecoverPasswordComponent } from './../../components/recover-password/recover-password.component';
import { ReturnToModel } from './../../models/return-to-model';
import { Location } from '@angular/common';
import { OneSignalNotificationsService } from './../../../api/one-signal-notifications.service';
import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { LoginService } from './../../../api/login.service';
import { NgForm } from '@angular/forms';
import { UserSignInModel, UserSignInInterface } from './../../models/user-sign-in';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ConfigGlobal } from '../../config/config-global';
import { ResponderModel } from '../../models/responder-model';
import { ValidatorData } from '../../helper/validations';
import { ResponseCommon } from '../../helper/is-success-response';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  providers: [ValidatorData, ResponseCommon, ProccessSignUp]
})

export class SignInPage implements OnInit {
  @ViewChild('socialNetworks', { static: false }) signInChange: SignInOrUpSocialNetworksComponent;
  public loader: boolean;
  public user: UserSignInModel;
  private backButtonPhysical: Subscription;
  public returnToLocation: ReturnToModel;
  public isIos: boolean;
  public loadFacebook: boolean;
  public loadGoogle: boolean;
  public loadApple: boolean;


  constructor(
    private loginService: LoginService,
    private location: Location,
    public validatorData: ValidatorData,
    public responseCommon: ResponseCommon,
    private toadNotificacionService: ToadNotificacionService,
    private activeRoute: ActivatedRoute,
    private platform: Platform,
    private route: Router,
    private modalCtr: ModalController,
    private oneSignalService: OneSignalNotificationsService,
    private usuarioService: UsuarioService,
    private proceesSignUp: ProccessSignUp
  ) {
    this.isIos = this.platform.is('ios');
    this.init();
    this.ionViewDidEnter();
    this.ionViewWillLeave();
  }

  ngOnInit() {
    if (localStorage.getItem("isRedirected") === "false" && !this.isIos) {
      localStorage.setItem("isRedirected", "true");
      location.reload();
    }

    this.activeRoute.queryParams.subscribe(params => {
      if (params.productos && params) {
        this.returnToLocation = JSON.parse(params.productos);
      }
    });

    this.activeRoute.queryParams.subscribe(params => {
      if (params.perfil && params) {
        this.returnToLocation = JSON.parse(params.perfil);
        localStorage.setItem('optionLogin', params.perfil);
      }
    });
  }

  private init() {
    this.loader = false;
    this.loadFacebook = false;
    this.loadGoogle = false;
    this.loadApple = false;
    this.user = new UserSignInModel(null, null);
  }
  private proccessSuccessAfterSignIn(response: any) {
    ConfigGlobal.setUser(response);
    localStorage.setItem("isRedirected", "false");
    const optionEnterLogin = localStorage.getItem('optionLogin');
    this.oneSignalService.setUserExternal();
    if (optionEnterLogin != null) {
      this.returnToLocation = JSON.parse(String(optionEnterLogin));
      this.goToRoute(this.returnToLocation.url);
    } else {
      window.location.assign("/tabs/inicio");
    }
    this.toadNotificacionService.exito(response.message);
    this.oneSignalService.setUserExternal();
    this.turnOfLoadSocialNetworks();
    this.loader = false;
  }

  public signInForm(form: NgForm) {
    this.loader = true;
    const user: UserSignInInterface = new UserSignInModel(form.value.user, form.value.password);
    this.signInCommon(user);
  }

  private signInCommon(user: UserSignInModel) {
    try {
      this.loginService.login(user).subscribe(
        (response) => {
          if (response.code === 200) {
            this.proccessSuccessAfterSignIn(response);
          } else {
            this.proccessErrorMessageBeforeSignUp();
          }
          this.loader = false;
        }, (error) => {
          this.loader = false;
          this.turnOfLoadSocialNetworks();
          this.toadNotificacionService.error(error);
        }
      );
    } catch (error) {
      this.toadNotificacionService.error(error);
      this.loader = false;
      this.turnOfLoadSocialNetworks();
    }
  }

  private proccessErrorMessageBeforeSignUp() {
    this.turnOfLoadSocialNetworks();
    this.loader = false;
    this.toadNotificacionService.alerta("Usuario y/o contraseña incorrectos");
  }

  ionViewWillLeave() {
    this.backButtonPhysical.unsubscribe();
  }

  ionViewDidEnter() {
    this.backButtonPhysical = this.platform.backButton.subscribe(() => {
      this.backPhysicalBottom();
    });
  }

  public backPhysicalBottom() {
    const optionEnterLogin = localStorage.getItem('optionLogin');
    this.returnToLocation = JSON.parse(String(optionEnterLogin));
    try {
      switch (this.returnToLocation.type) {
        case 'producto':
          this.location.back();
          break;
        case 'perfil':
          this.goToRoute(this.returnToLocation.url);
          break;
        default:
          this.location.back();
          break;
      }
    } catch (error) {
      this.location.back();
    }

  }

  private goToRoute(url: string) {
    this.route.navigate(["/tabs/inicio"], { queryParams: { byLogin: url } });
  }

  async recoverPassword() {
    const modal = await this.modalCtr.create({
      component: RecoverPasswordComponent,
    });
    await modal.present();
  }

  public toSignUp() {
    this.route.navigate(["/tabs/sign-up"]);
  }

  public response(response: ResponderModel) {
    if (this.responseCommon.validation(response)) {
      try {
        switch (response.socialNetwork) {
          case 'google':
            this.signInGoogle(response);
            break;
          case 'apple':
            this.signInApple(response);
            break;
          case 'facebook':
            this.signInFacebook(response);
            break;
          default:
            this.turnOfLoadSocialNetworks();
            this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
            break;
        }
      } catch (error) {
        this.turnOfLoadSocialNetworks();
        this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
      }
    } else {
      this.toadNotificacionService.error(this.responseCommon.errorMessage(response));
    }
  }
  private signInApple(response: ResponderModel) {
    const userApple: UserSignInInterface = new UserSignInModel(response.credentials.email, response.credentials.user);
    userApple.type = response.socialNetwork;
    this.userSignIn(userApple, response);
  }

  private signInGoogle(response: ResponderModel) {
    this.proccessSignInCommon(response);
  }

  private signInFacebook(response: ResponderModel) {
    this.proccessSignInCommon(response);
  }

  private proccessSignInCommon(response: ResponderModel) {
    if (!this.validatorData.validateSocialNetworkData(response.credentials)) {
      const userGoogle: UserSignInInterface = new UserSignInModel(response.credentials.user.email, response.credentials.user.providerData[0].uid);
      this.userSignIn(userGoogle, response);
    } else {
      this.turnOfLoadSocialNetworks();
      this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
    }
  }

  private userSignIn(user: UserSignInModel, responder: ResponderModel) {
    try {
      this.loginService.login(user).subscribe(
        (response) => {
          if (response.code === 200) {
            this.proccessSuccessAfterSignIn(response);
          } else {
            this.signUp(responder);
          }
        }, (error) => {
          this.turnOfLoadSocialNetworks();
          this.toadNotificacionService.error(error);
        }
      );
    } catch (error) {
      this.turnOfLoadSocialNetworks();
      this.toadNotificacionService.error("Error de conección");
    }
  }

  private signUp(response: ResponderModel) {
    try {
      switch (response.socialNetwork) {
        case 'google':
          this.createAccountWithGoogle(response);
          break;
        case 'apple':
          this.createAccountWithApple(response);
          break;
        case 'facebook':
          this.createAccountWithFacebook(response);
          break;
        default:
          this.turnOfLoadSocialNetworks();
          this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
          break;
      }
    } catch (error) {
      this.turnOfLoadSocialNetworks()
      this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
    }
  }

  private turnOfLoadSocialNetworks() {
    this.loadFacebook = false;
    this.loadGoogle = false;
    this.loadApple = false;
    this.loader = true;
    this.signInChange.loaderGoogle = false;
    this.signInChange.loaderFacebook = false;
    this.signInChange.loaderApple = false;
  }

  private proccessAfterCreateAccount(response: any, email: string, password: string, selectedSocialNetwork: SelectedSocialNetwork) {
    const respond: ResponderInterface = this.proceesSignUp.proccessAfterCreateAccount(response, email, password, selectedSocialNetwork);
    if (this.responseCommon.validation(respond)) {
      const user: UserSignInInterface = respond.credentials;
      this.signInCommon(user);
    } else {
      this.turnOfLoadSocialNetworks();
      this.toadNotificacionService.alerta(response.data.message);
    }
  }

  private createAccountWithApple(response: ResponderModel) {
    this.usuarioService.createAccountApple(response.credentials).subscribe(
      (respond) => {
        this.proccessAfterCreateAccount(respond, response.credentials.user, response.credentials.email, response.socialNetwork);
      },
      (error) => {

        this.signInChange.loaderApple = false;
        this.loadApple = false;
        this.toadNotificacionService.error(error);
      }
    );
  }

  private createAccountWithGoogle(response: ResponderModel) {
    const contentUser: ContentCommonUserSingUpInterface = this.proceesSignUp.proccessCreateAccountModel(response);
    this.usuarioService.createAccountWithGoogle(contentUser.content).subscribe(
      (respond) => {
        this.proccessAfterCreateAccount(respond, contentUser.content.email, contentUser.password, response.socialNetwork);
      },
      (error) => {
        this.signInChange.loaderGoogle = false;
        this.loadGoogle = false;
        this.toadNotificacionService.alerta(error);
      }
    );
  }

  private createAccountWithFacebook(response: ResponderModel) {
    const contentUser: ContentCommonUserSingUpInterface = this.proceesSignUp.proccessCreateAccountModel(response);
    this.usuarioService.createAccountWithFacebook(contentUser.content).subscribe(
      (respond) => {
        this.proccessAfterCreateAccount(respond, contentUser.content.email, contentUser.password, response.socialNetwork);
      },
      (error) => {
        this.loadFacebook = false;
        this.signInChange.loaderFacebook = false;
        this.toadNotificacionService.alerta(error);
      }
    );
  }
}
