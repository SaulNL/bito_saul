import { NotificationInterface } from './../../models/notifications-model';
import { CreateObjects } from './../../helper/create-object';
import { NotificationWithFirebaseService } from './../../../api/notification-with-firebase.service';
import { SelectedOptionSesionModel } from './../../models/selected-option-sesion-model';
import { OptionSesion } from './../../types/option-sesion';
import { SignInOrUpSocialNetworksComponent } from './../../components/sign-in-or-up-social-networks/sign-in-or-up-social-networks.component';
import { ResponderInterface } from './../../models/responder-model';
import { ContentCommonUserSingUpInterface } from './../../models/user-sign-up-model';
import { SelectedSocialNetwork } from './../../types/platform-type';
import { ProccessSignUp } from './../../helper/proccess-sign-up';
import { UsuarioService } from './../../../api/busqueda/login/usuario.service';
import { RecoverPasswordComponent } from './../../components/recover-password/recover-password.component';
import { ReturnToModel } from './../../models/return-to-model';
import { Location } from '@angular/common';
import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { LoginService } from './../../../api/login.service';
import { NgForm } from '@angular/forms';
import { UserSignInModel, UserSignInInterface } from '../../models/user-sign-in-model';
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
  providers: [ValidatorData, ResponseCommon, ProccessSignUp, CreateObjects]
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
    private usuarioService: UsuarioService,
    private proceesSignUp: ProccessSignUp,
    private notification: NotificationWithFirebaseService,
    private create: CreateObjects
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
  /**
   * @author Juan Antonio Guevara Flores
   * @description Iniciacion de valores por default
   */
  private init() {
    this.loader = false;
    this.loadFacebook = false;
    this.loadGoogle = false;
    this.loadApple = false;
    this.user = new UserSignInModel(null, null);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Proceso despues recibir una validacion correcta de las credenciales
   */
  private proccessSuccessAfterSignIn(response: any, optionSesion: SelectedOptionSesionModel) {
    ConfigGlobal.setUser(response);
    localStorage.setItem("isRedirected", "false");
    const optionEnterLogin = localStorage.getItem('optionLogin');
    this.inicializeNotification();
    if (optionEnterLogin != null) {
      this.returnToLocation = JSON.parse(String(optionEnterLogin));
      this.goToRoute(this.returnToLocation.url);
    } else {
      window.location.assign("/tabs/inicio");
    }
    this.toadNotificacionService.exito(response.message);
    this.optionSesionLoad(optionSesion);
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @param form
   * @description Inicio del proceso de sesion con el formulario
   */
  public signInForm(form: NgForm) {
    this.loader = true;
    const user: UserSignInInterface = new UserSignInModel(form.value.user, form.value.password);
    const optionSesion: SelectedOptionSesionModel = new SelectedOptionSesionModel('defaultUser');
    this.signInCommon(user, optionSesion);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param user
   * @param optionSesion
   * @description Inicio de sesion principal, usuario normal o con red social
   */
  private signInCommon(user: UserSignInModel, optionSesion: SelectedOptionSesionModel) {
    try {
      this.loginService.login(user).subscribe(
        (response) => {
          if (response.code === 200) {
            this.proccessSuccessAfterSignIn(response, optionSesion);
          } else {
            this.proccessErrorMessageBeforeSignIn(optionSesion);
          }
        }, (error) => {
          this.optionSesionLoad(optionSesion);
          this.toadNotificacionService.error(error);
        }
      );
    } catch (error) {
      this.toadNotificacionService.error(error);
      this.optionSesionLoad(optionSesion);
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Desactiva el loader dependiendo del inicio de sesion seleccionado
   */
  private optionSesionLoad(optionSesion: SelectedOptionSesionModel) {
    if (this.validatorData.validateOptionSesion(optionSesion.optionSesion)) {
      this.loader = false;
    } else {
      this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
    }
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Desactiva el loader de la red social seleccioanda
   */
  private optionSesionSocialNetworks(selectedSocialNetwork: SelectedSocialNetwork) {
    try {
      switch (selectedSocialNetwork) {
        case 'apple':
          this.signInChange.loaderApple = false;
          break;
        case 'google':
          this.signInChange.loaderGoogle = false;
          break;
        case 'facebook':
          this.signInChange.loaderFacebook = false;
          break;
        default:
          this.turnOfLoadSocialNetworks();
          break;
      }
    } catch (error) {
      this.toadNotificacionService.error(error);
      this.turnOfLoadSocialNetworks();
    }

  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param optionSesion
   * @description Proceso despues recibir una validacion incorrecta de las credenciales
   */
  private proccessErrorMessageBeforeSignIn(optionSesion: SelectedOptionSesionModel) {
    this.optionSesionLoad(optionSesion);
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
  /**
   * @author Juan Antonio Guevara Flores
   * @description Redirecciona a recuperar contraseña
   */
  async recoverPassword() {
    const modal = await this.modalCtr.create({
      component: RecoverPasswordComponent,
    });
    await modal.present();
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Redirige al page de sign-up-page
   */
  public toSignUp() {
    this.route.navigate(["/tabs/login/sign-up"]);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @description Respuesta de de datos de una red social para iniciar sesión
   */
  public response(response: ResponderModel) {
    const optionSesion: SelectedOptionSesionModel = new SelectedOptionSesionModel('socialNetwork', response.socialNetwork);
    if (this.responseCommon.validation(response)) {
      try {
        switch (response.socialNetwork) {
          case 'google':
            this.signInGoogle(response, optionSesion);
            break;
          case 'apple':
            this.signInApple(response, optionSesion);
            break;
          case 'facebook':
            this.signInFacebook(response, optionSesion);
            break;
          default:
            this.turnOfLoadSocialNetworks();
            this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
            break;
        }
      } catch (error) {
        this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
        this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
      }
    } else {
      this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
      this.toadNotificacionService.error(this.responseCommon.errorMessage(response));
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Inicio de proceso para sesión con Apple
   */
  private signInApple(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    const userApple: UserSignInInterface = new UserSignInModel(response.credentials.email, response.credentials.user);
    userApple.type = response.socialNetwork;
    this.userSignIn(userApple, response, optionSesion);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Inicio del proceso de sesión con Google
   */
  private signInGoogle(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    this.proccessSignInCommon(response, optionSesion);
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Inicio del proceso de sesión con Facebook
   */
  private signInFacebook(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    this.proccessSignInCommon(response, optionSesion);
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Proceso comun de Google y Facebook para validar las crendeciales
   */
  private proccessSignInCommon(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    if (!this.validatorData.validateSocialNetworkData(response.credentials)) {
      const userGoogle: UserSignInInterface = new UserSignInModel(response.credentials.user.email, response.credentials.user.providerData[0].uid);
      this.userSignIn(userGoogle, response, optionSesion);
    } else {
      this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
      this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param user
   * @param responder
   * @param optionSesion
   * @description Inicio de sesión y en el caso de que no exista crea la cuenta para redes sociales
   */
  private userSignIn(user: UserSignInModel, responder: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    try {
      this.loginService.login(user).subscribe(
        (response) => {
          if (response.code === 200) {
            this.proccessSuccessAfterSignIn(response, optionSesion);
          } else {
            this.signUp(responder, optionSesion);
          }
        }, (error) => {
          this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
          this.toadNotificacionService.error(error);
        }
      );
    } catch (error) {
      this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
      this.toadNotificacionService.error("Error de conección");
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Crear cuenta dependiendo de la red social
   */
  private signUp(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    try {
      switch (response.socialNetwork) {
        case 'google':
          this.createAccountWithGoogle(response, optionSesion);
          break;
        case 'apple':
          this.createAccountWithApple(response, optionSesion);
          break;
        case 'facebook':
          this.createAccountWithFacebook(response, optionSesion);
          break;
        default:
          this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
          this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
          break;
      }
    } catch (error) {
      this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
      this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Desactiva todos los loader en caso de error
   */
  private turnOfLoadSocialNetworks() {
    this.loadFacebook = false;
    this.loadGoogle = false;
    this.loadApple = false;
    this.loader = true;
    this.signInChange.loaderGoogle = false;
    this.signInChange.loaderFacebook = false;
    this.signInChange.loaderApple = false;
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param email
   * @param password
   * @param optionSesion
   * @description Proceso para iniciar sesión despues de crear la cuenta con una red social
   */
  private proccessAfterCreateAccount(response: any, email: string, password: string, optionSesion: SelectedOptionSesionModel) {
    const respond: ResponderInterface = this.proceesSignUp.proccessAfterCreateAccount(response, email, password, optionSesion.selectedSocialNetwork);
    if (this.responseCommon.validation(respond)) {
      const user: UserSignInInterface = respond.credentials;
      this.signInCommon(user, optionSesion);
    } else {
      this.optionSesionSocialNetworks(optionSesion.selectedSocialNetwork);
      this.toadNotificacionService.alerta(response.data.message);
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Crear cuenta con Apple
   */
  private createAccountWithApple(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    this.usuarioService.createAccountApple(response.credentials).subscribe(
      (respond) => {
        this.proccessAfterCreateAccount(respond, response.credentials.user, response.credentials.email, optionSesion);
      },
      (error) => {

        this.signInChange.loaderApple = false;
        this.loadApple = false;
        this.toadNotificacionService.error(error);
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Crear cuanta con Google
   */
  private createAccountWithGoogle(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    const contentUser: ContentCommonUserSingUpInterface = this.proceesSignUp.proccessCreateAccountModel(response);
    this.usuarioService.createAccountWithGoogle(contentUser.content).subscribe(
      (respond) => {
        this.proccessAfterCreateAccount(respond, contentUser.content.email, contentUser.password, optionSesion);
      },
      (error) => {
        this.signInChange.loaderGoogle = false;
        this.loadGoogle = false;
        this.toadNotificacionService.alerta(error);
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param optionSesion
   * @description Crear cuenta con Facebook
   */
  private createAccountWithFacebook(response: ResponderModel, optionSesion: SelectedOptionSesionModel) {
    const contentUser: ContentCommonUserSingUpInterface = this.proceesSignUp.proccessCreateAccountModel(response);
    this.usuarioService.createAccountWithFacebook(contentUser.content).subscribe(
      (respond) => {
        this.proccessAfterCreateAccount(respond, contentUser.content.email, contentUser.password, optionSesion);
      },
      (error) => {
        this.loadFacebook = false;
        this.signInChange.loaderFacebook = false;
        this.toadNotificacionService.alerta(error);
      }
    );
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida y registra token de notificaciones
   */
  private inicializeNotification() {
    if (this.validatorData.isTokenExist()) {
      this.registerTokenNotification();
    } else {
      this.notification.inicialize();
      this.registerTokenNotification();
    }
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Registra el token para las notificaciones
   */
  private registerTokenNotification() {
    const content: NotificationInterface = this.create.createNotificationFirebaseWithUser();
    this.notification.updateUserWithNotification(content);
  }
}
