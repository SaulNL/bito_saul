import { OptionBackLogin } from './../../Modelos/OptionBackLoginModel';
import { Component, OnInit } from "@angular/core";
import { Login } from "../../Modelos/login";
import { LoginService } from "../../api/login.service";
import { AppSettings } from "../../AppSettings";
import { Location } from "@angular/common";
import { SessionUtil } from "../../utils/sessionUtil";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { ModalController, NavController, Platform } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { RecuperarContraseniaPage } from "./recuperar-contrasenia/recuperar-contrasenia.page";
import { Subscription } from "rxjs";
import { Capacitor, Plugins, registerWebPlugin } from "@capacitor/core";
import { NavigationExtras } from "@angular/router";
import { FacebookLogin } from "@rdlabo/capacitor-facebook-login";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { AlertController } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  providers: [SessionUtil],
})
export class LoginPage implements OnInit {
  public usuario: Login;
  public loader: boolean;
  public subscribe;
  public backP: null;
  public backI: null;
  public validador: number;
  private backButtonSub: Subscription;
  public user: any;
  public logininfo: any;
  userData: any = {};
  private userFG: Login;
  public loadion: any;
  public optionBack: OptionBackLogin;
  picture;
  name;
  email;
  lastname;
  uid;
  public EnterUser: any;
  public inciarSesion: any;
  constructor(
    private navctrl: NavController,
    private loginService: LoginService,
    private location: Location,
    private sessionUtil: SessionUtil,
    private sideBarService: SideBarService,
    private _router: Router,
    private notifi: ToadNotificacionService,
    private modalController: ModalController,
    private rot: ActivatedRoute,
    private platform: Platform,
    private router: Router,
    private googlePlus: GooglePlus,
    private afAuth: AngularFireAuth,
    private fb: Facebook,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
    this.loader = false;
    this.usuario = new Login();
    this.ionViewDidEnter();
    this.ionViewWillLeave();
    registerWebPlugin(FacebookLogin);
    this.userFG = new Login();
    this.EnterUser = false;
    this.inciarSesion = 'Iniciando sesión';
  }

  ngOnInit(): void {
    if (localStorage.getItem("isRedirected") === "false") {
      localStorage.setItem("isRedirected", "true");
      location.reload();
      // window.location.assign(this.router.url);
    }
    this.rot.queryParams.subscribe(params => {
      if (params.productos && params) {
        this.optionBack = JSON.parse(params.productos);
      }
    });

    this.rot.queryParams.subscribe(params => {
      if (params.perfil && params) {
        this.optionBack = JSON.parse(params.perfil);
        localStorage.setItem('optionLogin', params.perfil);
      }
    });

  }

  ionViewDidEnter() {
    this.backButtonSub = this.platform.backButton.subscribe(() => {
      this.back();
    });
  }

  negocioRuta(negocioURL) {
    this._router.navigate(["/tabs/inicio"], { queryParams: { bylogin: negocioURL } });
  }
  ionViewWillLeave() {
    this.backButtonSub.unsubscribe();
  }
  enterlogin() {
    this.loader = true;
    this.EnterUser = true;
    this.present();
  }
  doLogin(data) {
    this.loginService.login(data).subscribe(
      (respuesta) => {
        if (respuesta.code === 200) {
          const actualizado = AppSettings.setTokenUser(respuesta);
          this.sideBarService.publishSomeData("");
          localStorage.setItem("isRedirected", "false");
          const optionLogin = localStorage.getItem('optionLogin');
          if(optionLogin != null ){
            this.negocioRuta(this.optionBack.url);
          } else {
            window.location.assign("/tabs/inicio");
            // this.location.assign("/tabs/inicio");
          }
          this.notifi.exito(respuesta.message);
          this.loader = false;
        }
        if (respuesta.code === 402) {
          this.loader = false;
          this.notifi.alerta("Usuario y/o contraseña incorrectos");
        }
      },
      (error) => {
        this.loader = false;
        this.notifi.error(error);
      }
    );
  }
  registratePersona() {
    this._router.navigate(["/tabs/registro-persona"]);
  }

  /**
   * *****************************************************
   * Funcion para login por facebook Y Google
   * @author Omar
   */

  /**
   * Login Web
   */
  async loginGoogleWeb() {
    const res = await this.afAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
    const user = res.user;

    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
    this.uid = user.uid;
    this.userFG.password = user.providerData[0].uid;
    this.userFG.usuario = this.email;

  }

  /**
   * Login Android
   */
  async loginGoogleAndroid() {
    this.loader = true;
    let res;
    if (this.platform.is('android')) {
      res = await this.googlePlus.login({
        webClientId:
          "315189899862-5hoe16r7spf4gbhik6ihpfccl4j9o71l.apps.googleusercontent.com",
        offline: true,
      });
    } else if (this.platform.is('ios')) {
      res = await this.googlePlus.login({
        webClientId:
          "315189899862-qtgalndbmc8ollkjft8lnpuboaqap8sa.apps.googleusercontent.com",
        offline: true,
      });

    } else {
      this.loader = false;
      this.notifi.alerta('Error Login Google');
    }

    this.present();
    const resConfirmed = await this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(res.idToken)
    );
    this.validationfg(resConfirmed);
  }

  /**
   * Movil o web
   */
  loginGoogle() {
    this.loginGoogleAndroid();

  }

  /**
   * Login Web
   */
  async loginFacebookWeb() {
    const res = await this.afAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
    const user = res.user;

    this.email = user.email;
    //this.uid = user.uid;
    this.userFG.password = user.providerData[0].uid;
    this.userFG.usuario = this.email;

  }

  /**
   * Login Android
   */
  async loginFacebookAndroid() {
    this.loader = true;
    const res: FacebookLoginResponse = await this.fb.login([
      "public_profile",
      "user_friends",
      "email",
    ]);
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      res.authResponse.accessToken
    );
    this.present();
    const resConfirmed = await this.afAuth.auth.signInWithCredential(
      facebookCredential
    );
    this.fb.logout();
    this.validationfg(resConfirmed);
  }

  /**
   * validationfg
   */
  public validationfg(inform) {
    this.loader = true;
    const resConfirmed = inform;
    if (
      typeof resConfirmed.user.providerData[0].uid === "undefined" ||
      resConfirmed.user.providerData[0].uid === null ||
      resConfirmed.user.providerData[0].uid === "undefined"
    ) {
      this.loader = false;
      this.notifi.error(
        "Se perdio la conexión con el servicio, Reintentar"
      );
    } else {
      const user = resConfirmed.user;
      this.email = user.email;
      this.userFG.password = user.providerData[0].uid;
      this.userFG.usuario = this.email;
      this.doLogin(this.userFG);
    }
  }
  /**
   * Movil o web
   */
  loginFacebook() {
    if (this.platform.is("capacitor")) {
      this.loginFacebookAndroid();
    } else {
      this.loginFacebookWeb();
    }
  }

  /**
   * Mensaje de error de datos
   */
  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Aviso",
      subHeader: "",
      message: "Datos incorrectos, verifique sus credenciales",
      buttons: ["OK"],
    });

    await alert.present();
  }

  async recuerarContrasenia() {
    // this._router.navigate(['/tabs/login/recuperar-contrasenia']);
    const modal = await this.modalController.create({
      component: RecuperarContraseniaPage,
    });
    await modal.present();
  }
  public back() {
    switch (this.optionBack.type) {
      case 'producto':
        this.location.back();
        break;
      case 'perfil':
        this.negocioRuta(this.optionBack.url);
        break;
      default:
        this.location.back();
        break;
    }
  }

  async present() {
    if (this.EnterUser) {
      this.EnterUser = false;
      this.doLogin(this.usuario);
    }
    this.EnterUser = false;
  }
}
