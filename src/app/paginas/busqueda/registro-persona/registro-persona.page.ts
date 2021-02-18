import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { UsuarioSistemaModel } from "src/app/Modelos/UsuarioSistemaModel";
import { Capacitor, Plugins, registerWebPlugin } from "@capacitor/core";
import { NavigationExtras } from "@angular/router";
import { FacebookLogin } from "@rdlabo/capacitor-facebook-login";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { UsuarioService } from "./../../../api/busqueda/login/usuario.service";
import { ToadNotificacionService } from "./../../../api/toad-notificacion.service";
import { LoginService } from "../../../api/login.service";
import { Login } from "../../../Modelos/login";
import { AppSettings } from "../../../AppSettings";
import { NavController } from "@ionic/angular";
import { SideBarService } from "../../../api/busqueda/side-bar-service";
import { LoadingController,Platform } from "@ionic/angular";

@Component({
  selector: "app-registro-persona",
  templateUrl: "./registro-persona.page.html",
  styleUrls: ["./registro-persona.page.scss"],
})
export class RegistroPersonaPage implements OnInit {
  public usuario_sistema: UsuarioSistemaModel;
  public blnContraseniaIgual: boolean;
  public condiciones_servicio: boolean = false;
  private usuario: Login;
  public loader: any;
  private passFace: any;
  private passGogl: any;

  constructor(
    private router: Router,
    private active: ActivatedRoute,
    private googlePlus: GooglePlus,
    private afAuth: AngularFireAuth,
    private fb: Facebook,
    private usuarioSistema: UsuarioService,
    private notificacion: ToadNotificacionService,
    private loginService: LoginService,
    private navctrl: NavController,
    private sideBarService: SideBarService,
    public loadingController: LoadingController,
    private platform: Platform
  ) {
    this.usuario = new Login();
    //   this.condiciones_servicio = false;
    registerWebPlugin(FacebookLogin);
  }

  ngOnInit() {
    this.usuario_sistema = new UsuarioSistemaModel();
    this.blnContraseniaIgual = true;
  }
  public abrirTerminosCondiciones() {
    window.open(
      "https://ecoevents.blob.core.windows.net/comprandoando/documentos%2FTERMINOS%20Y%20CONDICIONES%20Bitoo.pdf",
      "_blank"
    );
  }
  confirmacionRegistro(formRegistroPersona: NgForm) {
    let navigationExtras = JSON.stringify(this.usuario_sistema);
    this.router.navigate(["/tabs/registro-persona/confirma-registro"], {
      queryParams: { special: navigationExtras },
    });
  }
  regresarLogin(formRegistroPersona: NgForm) {
    formRegistroPersona.resetForm();
    this.router.navigate(["/tabs/login"]);
  }
  public verificarContrasena() {
    this.blnContraseniaIgual = true;

    if (
      this.usuario_sistema.password !== "" &&
      this.usuario_sistema.repeat_password !== "" &&
      this.usuario_sistema.password !== this.usuario_sistema.repeat_password
    ) {
      this.blnContraseniaIgual = false;
    }
  }
  public aceptar_condiciones_servicio(event) {
    this.condiciones_servicio = false;
    if (event.detail.checked) {
      this.condiciones_servicio = true;
    }
  }

  async loginGoogle() {
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
    this.notificacion.alerta('Error Login Google');
  }
    this.presentLoading();
    const resConfirmed = await this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(res.idToken)
    );
    this.validationfg(resConfirmed, 2);
  }

  async loginFacebook() {
    const res: FacebookLoginResponse = await this.fb.login([
      "public_profile",
      "user_friends",
      "email",
    ]);
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
      res.authResponse.accessToken
    );
    this.presentLoading();
    const resConfirmed = await this.afAuth.auth.signInWithCredential(
      facebookCredential
    );
    this.fb.logout();
    this.validationfg(resConfirmed, 1);
  }

  doLogin() {
    //this.loader = true;
    //console.log(this.usuario);

    this.loginService.login(this.usuario).subscribe(
      (respuesta) => {
        //console.log(respuesta);

        if (respuesta.code === 200) {
          const actualizado = AppSettings.setTokenUser(respuesta);
          //console.log(respuesta.data);
          // this.sideBarService.actualizarSide();
          // this.loader = false;
          this.sideBarService.publishSomeData("");
          localStorage.setItem("isRedirected", "false");
          this.loader.dismiss();
          this.router.navigate(["/tabs/inicio"]);
          this.notificacion.exito(respuesta.message);
        }
        if (respuesta.code === 402) {
          this.loader.dismiss();
          this.notificacion.alerta("Usuario y/o contraseña incorrectos");
        }
      },
      (error) => {
        this.loader.dismiss();
        this.notificacion.error(error);
      }
    );
  }
  async presentLoading() {
    this.loader = await this.loadingController.create({
      spinner: "crescent",
      cssClass: "my-custom-class",
      message: "Creando Cuenta...",
    });
    await this.loader.present();
  }

  /**
   * validationfg
   */
  public validationfg(inform, forg) {
    const resConfirmed = inform;
    if ( typeof resConfirmed.user.providerData[0].uid === "undefined" || resConfirmed.user.providerData[0].uid === null || resConfirmed.user.providerData[0].uid === "undefined") {
      switch (forg) {
        case 1:
          this.loader.dismiss();
          this.notificacion.error(
            "Se perdio la conexión con el servicio de Facebook, Reintentar"
          );
          break;
        case 2:
          this.loader.dismiss();
          this.notificacion.error(
            "Se perdio la conexión con el servicio de Google, Reintentar"
          );
          break;
      }
    } else {
      switch (forg) {
        case 1:
          this.facebook(resConfirmed);
          break;
        case 2:
          this.google(resConfirmed);
          break;
        default:
          this.notificacion.error("Error");
          break;
      }
    }
  }
  facebook(datosFacebook) {
    const resConfirmed = datosFacebook;
    const user = resConfirmed.user;
    this.passFace = user.providerData[0].uid;
    let data = {
      firstName: user.providerData[0].displayName,
      email: user.providerData[0].email,
      photoUrl: user.providerData[0].photoURL,
      id: user.providerData[0].uid,
    };
    this.usuarioSistema.crearCuantaAdminFacebook(data).subscribe(
      (response) => {
        //console.log(response.data);
        if (response.data.code === 200) {
          // console.log(this.passFace);
          // console.log(this.usuario);
          this.usuario.password = this.passFace;
          this.usuario.usuario = data.email;
          //console.log(this.usuario);
          this.doLogin();
        } else {
          this.loader.dismiss();
          this.notificacion.alerta(response.data.message);
        }
      },
      (error) => {
        this.loader.dismiss();
        this.notificacion.alerta(error);
      }
    );
    /*
      this.picture = user.photoURL;
      this.name = user.displayName;
      this.email = user.email;
      this.usuario.password = user.providerData[0].uid;
      this.usuario.usuario = this.email;
      console.log(user);
      this.doLogin();*/
  }
  google(datosGoogle) {
    const resConfirmed = datosGoogle;
    const user = resConfirmed.user;
    //console.log(user);
    this.passGogl = user.providerData[0].uid;
    let data = {
      firstName: user.providerData[0].displayName,
      email: user.providerData[0].email,
      photoUrl: user.providerData[0].photoURL,
      id: user.providerData[0].uid,
    };
    this.usuarioSistema.crearCuantaAdminGoogle(data).subscribe(
      (response) => {
        //console.log(response.data);
        if (response.data.code === 200) {
          //console.log(this.passGogl);
          //console.log(this.usuario);
          this.usuario.password = this.passGogl;
          this.usuario.usuario = data.email;
          //console.log(this.usuario);
          this.doLogin();
        } else {
          this.loader.dismiss();
          this.notificacion.alerta(response.data.message);
        }
      },
      (error) => {
        this.loader.dismiss();
        this.notificacion.alerta(error);
      }
    );
    /*
    this.picture = user.photoURL;
    this.name = user.displayName;
    this.email = user.email;
    this.uid = user.uid;
    this.usuario.password = user.providerData[0].uid;
    this.usuario.usuario = this.email;
    console.log(user);
    this.doLogin();*/
  }
}
