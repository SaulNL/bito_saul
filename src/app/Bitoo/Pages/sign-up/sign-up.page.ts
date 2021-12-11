import { SignInOrUpSocialNetworksComponent } from './../../components/sign-in-or-up-social-networks/sign-in-or-up-social-networks.component';
import { ProccessSignUp } from './../../helper/proccess-sign-up';
import { SelectedSocialNetwork } from './../../types/platform-type';
import { LoginService } from './../../../api/login.service';
import { OneSignalNotificationsService } from './../../../api/one-signal-notifications.service';
import { ActivatedRoute } from '@angular/router';
import { UserSignInModel, UserSignInInterface } from './../../models/user-sign-in';
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
import { UserSignUpModel, CommonUserSignUpInterface, CommonUserSingUpModel, ContentCommonUserSingUpModel, ContentCommonUserSingUpInterface } from './../../models/user-sign-up-model';
import { ValidatorData } from '../../helper/validations';
import { ResponseCommon } from '../../helper/is-success-response';
import { ConfigGlobal } from '../../config/config-global';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  providers: [ValidatorData, ResponseCommon, ProccessSignUp]
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
    private oneSignalService: OneSignalNotificationsService,
    private proceesSignUp: ProccessSignUp) {
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

  public backTo(event: NgForm) {
    event.resetForm();
    this.backToSignIn();
  }
  private backToSignIn() {
    this.init();
    this.router.navigate(['tabs/login']);
  }
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
  private redirectSuccess(isSuccess: any) {
    if (typeof isSuccess !== 'undefined') {
      this.oneSignalService.setUserExternal();
      this.router.navigate(['/tabs/inicio']);
      setTimeout(() => {
        location.reload();
      }, 1300);
    }
  }

  public openTermsConditions() {
    window.open(
      'https://ecoevents.blob.core.windows.net/comprandoando/documentos%2FTERMINOS%20Y%20CONDICIONES%20Bitoo.pdf',
      '_blank'
    );
  }

  public aceptTermsConditions(event: boolean) {
    this.termsConditions = false;
    if (event) {
      this.termsConditions = true;
    }
  }

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

  public validatePassword() {
    this.validateRepeadPassword = true;
    if (this.user.password !== '' && this.user.repeat_password !== '' && this.user.password !== this.user.repeat_password) {
      this.validateRepeadPassword = false;
    }
  }

  public disableButtom(formSignUp: NgForm) {
    return formSignUp.invalid || !this.termsConditions || !this.validateRepeadPassword;
  }

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
      this.toadNotificacionService.error(this.responseCommon.errorMessage(response));
    }
  }

  public turnOfLoadSocialNetworks() {
    this.signUnChange.loaderGoogle = false;
    this.signUnChange.loaderFacebook = false;
    this.signUnChange.loaderApple = false;
    this.loadFacebook = false;
    this.loadGoogle = false;
    this.loadApple = false;
  }

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

  private userSignIn(user: UserSignInModel) {
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
          this.toadNotificacionService.exito(response.message);
          this.oneSignalService.setUserExternal();
          this.turnOfLoadSocialNetworks();
        } else {
          this.turnOfLoadSocialNetworks();
          this.toadNotificacionService.alerta("Usuario y/o contraseña incorrectos");
        }
      },
      (error) => {
        this.turnOfLoadSocialNetworks();
        this.toadNotificacionService.error(error);
      }
    );
  }

  goToBusiness(businessRoute: string) {
    this.router.navigate(["/tabs/inicio"], { queryParams: { byLogin: businessRoute } });
  }
  private getPictureProfile(response: ResponderModel): string {
    return (response.socialNetwork === 'facebook') ? response.credentials.additionalUserInfo.profile.picture.data.url : response.credentials.additionalUserInfo.profile.picture;
  }
  private specialProccessBeforeCreateAccount(response: ResponderModel) {
    const content = response.credentials;
    const credentials = content.user;
    const password = credentials.providerData[0].uid;
    const photo: string = this.getPictureProfile(response);
    const user: CommonUserSignUpInterface = new CommonUserSingUpModel(credentials.providerData[0].displayName,
      credentials.providerData[0].email, photo, password);
    return new ContentCommonUserSingUpModel(password, user);
  }

  private specialProccessAfterCreateAccount(response: any, email: string, password: string, selectedSocialNetwork: SelectedSocialNetwork) {
    const respond: ResponderInterface = this.proceesSignUp.proccessAfterCreateAccount(response, email, password, selectedSocialNetwork);
    if (this.responseCommon.validation(respond)) {
      const user: UserSignInInterface = respond.credentials;
      this.userSignIn(user);
    } else {
      this.turnOfLoadSocialNetworks();
      this.toadNotificacionService.alerta(response.data.message);
    }
  }
}
