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
import { LoadingController } from '@ionic/angular';

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
  public loadion:any;
  picture;
  name;
  email;
  lastname;
  uid;

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
  }

  ngOnInit(): void {}
  ionViewDidEnter() {
    this.backButtonSub = this.platform.backButton.subscribe(() => {
      this.back();
    });
  }
  ionViewWillLeave() {
    this.backButtonSub.unsubscribe();
  }
  enterlogin(){
    this.presentLoading()
    this.doLogin(this.usuario);
  }
  doLogin(data) {
    this.loader = true;
    console.log(data);
    this.loginService.login(data).subscribe(
      (respuesta) => {
        console.log(respuesta);
        if (respuesta.code === 200) {
          const actualizado = AppSettings.setTokenUser(respuesta);
          // this.sideBarService.actualizarSide();
          // this.loader = false;
          this.sideBarService.publishSomeData("");
          localStorage.setItem("isRedirected", "false");
          this.loadion.dismiss();
          this._router.navigate(['/tabs/inicio']);
          this.notifi.exito(respuesta.message);
        }
        if (respuesta.code === 402) {
          this.loadion.dismiss();
          this.notifi.alerta("Usuario y/o contraseña incorrectos");
        }
      },
      (error) => {
        this.loadion.dismiss();
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
    console.log("Datos de usuario Google:", user.providerData);
    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
    this.uid = user.uid;
    this.userFG.password = user.providerData[0].uid;
    this.userFG.usuario = this.email;
    //console.log(this.usuario);
    //this.doLogin();
  }

  /**
   * Login Android
   */
  async loginGoogleAndroid() {
    const res = await this.googlePlus.login({
      webClientId:
        "923911532405-77uvn5rfg78cc0f1bis1lve31bahu3jc.apps.googleusercontent.com",
      offline: true,
    });
    const resConfirmed = await this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(res.idToken)
    );
    this.presentLoading()
    const user = resConfirmed.user;
    this.picture = user.photoURL;
    //this.name = user.displayName;
    this.email = user.email;
    //this.uid = user.uid;
    this.userFG.password = user.providerData[0].uid;
    this.userFG.usuario = this.email;
    this.doLogin(this.userFG);
  }

  /**
   * Movil o web
   */
  loginGoogle() {
    if (this.platform.is("android")) {
      this.loginGoogleAndroid();
    } else {
      this.loginGoogleWeb();
    }
  }

  /**
   * Login Web
   */
  async loginFacebookWeb() {
    const res = await this.afAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
    const user = res.user;
    //console.log("Datos de usuario Facebook:", user);
    //this.picture = user.photoURL;
    //this.name = user.displayName;
    this.email = user.email;
    //this.uid = user.uid;
    this.userFG.password = user.providerData[0].uid;
    this.userFG.usuario = this.email;
    //console.log(this.usuario);
    //this.doLogin();
  }

  /**
   * Login Android
   */
  async loginFacebookAndroid() {
    const res: FacebookLoginResponse = await this.fb.login(['public_profile', 'user_friends', 'email']);
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      res.authResponse.accessToken
    );
    const resConfirmed = await this.afAuth.auth.signInWithCredential(
      facebookCredential
    );
    this.presentLoading()
    const user = resConfirmed.user;
    //this.picture = user.photoURL;
    //this.name = user.displayName;
    this.email = user.email;
    this.userFG.password = user.providerData[0].uid;
    this.userFG.usuario = this.email;
    this.doLogin(this.userFG);
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
    this.location.back();
  }

  async presentLoading() {
    this.loadion = await this.loadingController.create({
  cssClass: 'my-custom-class',
  message: 'Iniciando sesión...'
});
await this.loadion.present();
}
}
