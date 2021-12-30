import { CreateObjects } from './../../helper/create-object';
import { NotificationInterface } from './../../models/notifications-model';
import { NotificationWithFirebaseService } from './../../../api/notification-with-firebase.service';
import { SignInOrUpSocialNetworksComponent } from './../../components/sign-in-or-up-social-networks/sign-in-or-up-social-networks.component';
import { ProccessSignUp } from './../../helper/proccess-sign-up';
import { SelectedSocialNetwork } from './../../types/platform-type';
import { LoginService } from './../../../api/login.service';
import { ActivatedRoute } from '@angular/router';
import { UserSignInModel, UserSignInInterface } from '../../models/user-sign-in-model';
import { UsuarioService } from './../../../api/busqueda/login/usuario.service';
import { ToadNotificacionService } from './../../../api/toad-notificacion.service';
import { ResponderModel, ResponderInterface } from './../../models/responder-model';
import { ModalConfirmSignUpComponent } from './../../components/modal-confirm-sign-up/modal-confirm-sign-up.component';
import { ModalController, Platform } from '@ionic/angular';
import { ToSend } from './../../types/to-send-type';
import { MessageTo } from './../../types/message-to-type';
import { ShippingMethod } from '../../types/shipping-method-type';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSignUpModel, ContentCommonUserSingUpInterface } from './../../models/user-sign-up-model';
import { ValidatorData } from '../../helper/validations';
import { ResponseCommon } from '../../helper/is-success-response';
import { ConfigGlobal } from '../../config/config-global';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  providers: [ValidatorData, ResponseCommon, ProccessSignUp, CreateObjects]
})
export class SignUpPage implements OnInit {
  @ViewChild('socialNetwork', { static: false }) signUnChange: SignInOrUpSocialNetworksComponent;
  public user: UserSignUpModel;
  public repeatPassword: boolean;
  public termsConditions: boolean;
  public requiredMail: boolean;
  public requiredPhone: boolean;
  public toSend: ToSend;
  public messageTo: MessageTo;
  public shippingMethod: ShippingMethod;
  public validateRepeadPassword: boolean;
  public isIos: boolean;
  public loadFacebook: boolean;
  public loadGoogle: boolean;
  public loadApple: boolean;
  constructor(
    private router: Router,
    private modalCtr: ModalController,
    private platform: Platform,
    public validatorData: ValidatorData,
    public responseCommon: ResponseCommon,
    private toadNotificacionService: ToadNotificacionService,
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private activateRoute: ActivatedRoute,
    private proceesSignUp: ProccessSignUp,
    private notification: NotificationWithFirebaseService,
    private create: CreateObjects
  ) {
    this.isIos = this.platform.is('ios');
    this.init();
  }

  ngOnInit() {
    this.activateRoute.queryParams.subscribe(
      params => {
        if (params && params.signUp) {
          this.init();
        }
      }
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param event
   * @description Resetea el formulario y regresa al inicio de sesión
   */
  public backTo(event: NgForm) {
    event.resetForm();
    this.backToSignIn();
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa los valores por default y regresa al inicio de sesión
   */
  private backToSignIn() {
    this.init();
    this.router.navigate(['tabs/login']);
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param form
   * @description Obtiene los datos del formulario y los prepara en un model nuevo
   */
  public signUp(form: NgForm) {
    const data: UserSignUpModel = new UserSignUpModel();
    data.ms_persona.nombre = form.value.first_name;
    data.ms_persona.paterno = form.value.last_name;
    data.ms_persona.materno = form.value.mother_last_name;
    data.ms_persona.correo = form.value.email;
    data.ms_persona.telefono_celular = form.value.phone;
    data.password = form.value.password;
    data.repeat_password = form.value.repeat_password;
    this.openModalConfirmSingUp(data);
  }

  /**
   * @author Juan Antonio Guevara Flores
   * @param user
   * @description Abre el modal para confirmar cuenta, mandando los datos de fomulario el tipo de mensaje a que tipo se envia y el metodo de de envio para el servicio
   */
  async openModalConfirmSingUp(user: UserSignUpModel) {
    const modal = await this.modalCtr.create({
      component: ModalConfirmSignUpComponent,
      componentProps: {
        formSignUp: user,
        messageTo: this.messageTo,
        toSend: this.toSend,
        shippingMethod: this.shippingMethod
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(
      (response) => {
        this.redirectSuccess(response.data);
      });
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param isSuccess
   * @description Redireccion al inicio si se recibio una respuesta del modal
   */
  private redirectSuccess(isSuccess: any) {
    if (typeof isSuccess !== 'undefined') {
      this.router.navigate(['/tabs/inicio']);
      this.inicializeNotification();
      setTimeout(() => {
        location.reload();
      }, 1300);
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Abre los terminos y condiciones
   */
  public openTermsConditions() {
    window.open(
      'https://ecoevents.blob.core.windows.net/comprandoando/documentos%2FTERMINOS%20Y%20CONDICIONES%20Bitoo.pdf',
      '_blank'
    );
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param event
   * @description Cambia la validacion de requiere aceptar terminos y condiciones en el formulario
   */
  public aceptTermsConditions(event: boolean) {
    this.termsConditions = false;
    if (event) {
      this.termsConditions = true;
    }
  }
  /**
   * @author Juan Antonio Guuevara flores
   * @param event
   * @description Cambia la validacion de requerido el telefono
   */
  public mailProccess(event: any) {
    if (event !== 'undefined' && event !== null && event.length > 4) {
      this.messageTo = 'correo';
      this.toSend = 'correo';
      this.requiredPhone = false;
      this.shippingMethod = 2;
    } else {
      this.requiredPhone = true;
      this.shippingMethod = 1;
      this.toSend = 'sms a tu celular';
      this.messageTo = 'número celular';
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param event
   * @description Cambia la validacion de requerido el correo
   */
  phoneProccess(event: any) {
    if (event !== 'undefined' && event !== null && event.length === 10) {
      this.requiredMail = false;
      this.messageTo = 'número celular';
      this.toSend = 'sms a tu celular';
      this.shippingMethod = 1;
    } else {
      this.requiredMail = true;
      this.toSend = 'correo';
      this.shippingMethod = 2;
      this.messageTo = 'correo';
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Valida la contraseña que sea igual
   */
  public validatePassword() {
    this.validateRepeadPassword = true;
    if (this.user.password !== '' && this.user.repeat_password !== '' && this.user.password !== this.user.repeat_password) {
      this.validateRepeadPassword = false;
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param formSignUp
   * @description Desabilita el boton de crear cuenta si no estan completas las validaciones
   * @returns boolean
   */
  public disableButtom(formSignUp: NgForm): boolean {
    return formSignUp.invalid || !this.termsConditions || !this.validateRepeadPassword;
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @description Inicializa las variables por default
   */
  private init() {
    this.user = new UserSignUpModel();
    this.termsConditions = false;
    this.toSend = 'codigo';
    this.messageTo = 'número celular';
    this.requiredMail = true;
    this.requiredPhone = true;
    this.validateRepeadPassword = true;
    this.loadFacebook = false;
    this.loadGoogle = false;
    this.loadApple = false;
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @description Respuesta de de datos de una red social para crear cuenta
   */
  public response(response: ResponderModel) {
    if (this.responseCommon.validation(response)) {
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
        this.turnOfLoadSocialNetworks();
        this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
      }
    } else {
      this.SetSocialNetworkLoadTurnOf(response.socialNetwork);
      this.toadNotificacionService.error(this.responseCommon.errorMessage(response));
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param selected
   * @description Finaliza el loader dependiendo de la red social
   */
  private SetSocialNetworkLoadTurnOf(selected: SelectedSocialNetwork) {
    try {
      switch (selected) {
        case 'google':
          this.signUnChange.loaderGoogle = false;
          break;
        case 'apple':
          this.signUnChange.loaderApple = false;
          break;
        case 'facebook':
          this.signUnChange.loaderFacebook = false;
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
   * @description Finaliza en caso de error todos los loader
   */
  public turnOfLoadSocialNetworks() {
    this.signUnChange.loaderGoogle = false;
    this.signUnChange.loaderFacebook = false;
    this.signUnChange.loaderApple = false;
    this.loadFacebook = false;
    this.loadGoogle = false;
    this.loadApple = false;
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @description Proceso para crear una cuenta con Apple
   */
  private createAccountWithApple(response: ResponderModel) {
    if (this.validatorData.validateApple(response)) {
      this.usuarioService.createAccountApple(response.credentials).subscribe(
        (respond) => {
          this.specialProccessAfterCreateAccount(respond, response.credentials.user, response.credentials.email, response.socialNetwork);
        },
        (error) => {
          this.toadNotificacionService.error(error);
          this.loadApple = false;
        }
      );
    } else {
      this.loadApple = false;
      this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
    }
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @description Proceso para crear una cuenta con Google
   */
  private createAccountWithGoogle(response: ResponderModel) {
    if (!this.validatorData.validateSocialNetworkData(response.credentials)) {
      const contentUser: ContentCommonUserSingUpInterface = this.proceesSignUp.proccessCreateAccountModel(response);
      this.usuarioService.createAccountWithGoogle(contentUser.content).subscribe(
        (respond) => {
          this.specialProccessAfterCreateAccount(respond, contentUser.content.email, contentUser.password, response.socialNetwork);
        },
        (error) => {
          this.loadGoogle = false;
          this.toadNotificacionService.alerta(error);
        }
      );
    } else {
      this.loadGoogle = false;
      this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
    }

  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @description Proceso para crear una cuenta con Facebook
   */
  private createAccountWithFacebook(response: ResponderModel) {
    if (!this.validatorData.validateSocialNetworkData(response.credentials)) {
      const contentUser: ContentCommonUserSingUpInterface = this.proceesSignUp.proccessCreateAccountModel(response);
      this.usuarioService.createAccountWithFacebook(contentUser.content).subscribe(
        (respond) => {
          this.specialProccessAfterCreateAccount(respond, contentUser.content.email, contentUser.password, response.socialNetwork);
        },
        (error) => {
          this.toadNotificacionService.alerta(error);
          this.signUnChange.loaderFacebook = false;
          this.loadFacebook = false;
        }
      );
    } else {
      this.signUnChange.loaderFacebook = false;
      this.loadFacebook = false;
      this.toadNotificacionService.error(this.validatorData.messageErrorValidationSocialNetworkData());
    }
  }

  private userSignIn(user: UserSignInModel, selectedSocialNetwork: SelectedSocialNetwork) {
    this.loginService.login(user).subscribe(
      (response) => {
        if (response.code === 200) {
          ConfigGlobal.setUser(response);
          const optionLogin = localStorage.getItem('optionLogin');
          localStorage.setItem("isRedirected", "false");
          if (optionLogin != null) {
            const dataBusiness = JSON.parse(optionLogin);
            this.goToBusiness(dataBusiness.url);
          } else {
            this.router.navigate(["/tabs/inicio"]);
          }
          this.inicializeNotification();
          this.toadNotificacionService.exito(response.message);
          this.SetSocialNetworkLoadTurnOf(selectedSocialNetwork);
        } else {
          this.SetSocialNetworkLoadTurnOf(selectedSocialNetwork);
          this.toadNotificacionService.alerta("Usuario y/o contraseña incorrectos");
        }
      },
      (error) => {
        this.SetSocialNetworkLoadTurnOf(selectedSocialNetwork);
        this.toadNotificacionService.error(error);
      }
    );
  }

  goToBusiness(businessRoute: string) {
    this.router.navigate(["/tabs/inicio"], { queryParams: { byLogin: businessRoute } });
  }
  /**
   * @author Juan Antonio Guevara Flores
   * @param response
   * @param email
   * @param password
   * @param selectedSocialNetwork
   * @description Proceso para despues de crear una cuenta con una red social con Facebook, Google y Apple
   */
  private specialProccessAfterCreateAccount(response: any, email: string, password: string, selectedSocialNetwork: SelectedSocialNetwork) {
    const respond: ResponderInterface = this.proceesSignUp.proccessAfterCreateAccount(response, email, password, selectedSocialNetwork);
    if (this.responseCommon.validation(respond)) {
      const user: UserSignInInterface = respond.credentials;
      this.userSignIn(user, selectedSocialNetwork);
    } else {
      this.SetSocialNetworkLoadTurnOf(selectedSocialNetwork);
      this.toadNotificacionService.alerta(response.data.message);
    }
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
