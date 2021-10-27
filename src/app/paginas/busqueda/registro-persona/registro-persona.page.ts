import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { UsuarioSistemaModel } from "src/app/Modelos/UsuarioSistemaModel";
import { Capacitor, Plugins, registerWebPlugin } from "@capacitor/core";
import { NavigationExtras } from "@angular/router";
//import { FacebookLogin } from "@rdlabo/capacitor-facebook-login";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";
import { UsuarioService } from "../../../api/busqueda/login/usuario.service";
import { ToadNotificacionService } from "../../../api/toad-notificacion.service";
import { LoginService } from "../../../api/login.service";
import { Login } from "../../../Modelos/login";
import { AppSettings } from "../../../AppSettings";
import { NavController } from "@ionic/angular";
import { SideBarService } from "../../../api/busqueda/side-bar-service";
import { LoadingController, Platform } from "@ionic/angular";
import {AppleSignInErrorResponse, AppleSignInResponse, ASAuthorizationAppleIDRequest, SignInWithApple} from "@ionic-native/sign-in-with-apple/ngx";

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
  public msj: "Creando cuenta";
  public blnTelefono: boolean;
  public blnCorreo: boolean;
  private medio: number | null;
  public isIOS: boolean;
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
    private platform: Platform,
    private signInWithApple: SignInWithApple
  ) {
    this.usuario = new Login('', '');
    this.loader = false;
    this.blnCorreo = true;
    this.blnTelefono = true;
    this.isIOS = this.platform.is('ios');
    //   this.condiciones_servicio = false;
    // @ts-ignore
    //registerWebPlugin(FacebookLogin);
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
    this.usuario_sistema.medio = this.medio;
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
    try{
      this.loader = true;
      let res;
      if (this.platform.is("android")) {
        res = await this.googlePlus.login({
          webClientId:
            "315189899862-5hoe16r7spf4gbhik6ihpfccl4j9o71l.apps.googleusercontent.com",
          offline: true,
        });
        this.processLoginGoogle(res);
      } else if (this.platform.is("ios")) {
        res = await this.googlePlus.login({
          webClientId:
            "315189899862-qtgalndbmc8ollkjft8lnpuboaqap8sa.apps.googleusercontent.com",
          offline: true,
        });
        this.processLoginGoogle(res);
      } else {
        this.loader = false;
        this.notificacion.alerta("Error Login Google");
      }
    }catch (error) {
      this.loader = false;
      this.notificacion.alerta("Se perdio la conexión con el servicio, Reintentar");
    }
  }

  async processLoginGoogle(res: any) {
    const resConfirmed = await this.afAuth.auth.signInWithCredential(
      firebase.auth.GoogleAuthProvider.credential(res.idToken)
    );
    this.validationfg(resConfirmed, 2);
  }

  async loginFacebook() {
    try{
      this.loader = true;
      let permissions = [];
      if(this.platform.is('android')) {
        permissions = [
          "public_profile",
          "user_friends",
          "email",
        ];
      }else if (this.platform.is('ios')){
        permissions = [
          "public_profile",
          "email",
        ];
      }
      const res: FacebookLoginResponse = await this.fb.login(permissions);
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
        res.authResponse.accessToken
      );
      const resConfirmed = await this.afAuth.auth.signInWithCredential(
        facebookCredential
      );
      this.fb.logout();
      this.validationfg(resConfirmed, 1);
    } catch (e) {
      this.loader = false;
      this.notificacion.alerta("Se perdio la conexión con el servicio, Reintentar");
    }
  }
  async loginAppleId(){
    try{
      this.signInWithApple.signin({
        requestedScopes: [
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
          ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail
        ]
      })
          .then((res: AppleSignInResponse) => {
            if (res.email !== '' || res.email.length > 0){

              this.usuarioSistema.crearCuantaAdminApple(res).subscribe(
                  (response) => {
                    if (response.data.code === 200) {
                      this.usuario.password = res.user;
                      this.usuario.usuario = res.email;
                      this.doLogin();
                    } else {
                      this.loader = false;
                      this.notificacion.alerta(response.data.message);
                    }
                  },
                  (error) => {
                    this.loader = false;
                    this.notificacion.alerta(error);
                  }
              );
            }else{
              this.notificacion.alerta("La cuenta no se puede usar en este momento, intente más tarde");
            }
            console.log(JSON.stringify(res));
          })
          .catch((error: AppleSignInErrorResponse) => {
            this.notificacion.alerta("Se perdio la conexión con el servicio, Reintentar");
            console.error(JSON.stringify(error));
          });
    }catch (error){
      this.notificacion.alerta("Se perdio la conexión con el servicio, Reintentar");
    }
  }

  doLogin() {
    this.loginService.login(this.usuario).subscribe(
      (respuesta) => {
        if (respuesta.code === 200) {
          const actualizado = AppSettings.setTokenUser(respuesta);
          this.sideBarService.publishSomeData("");
          const optionLogin = localStorage.getItem('optionLogin');
          localStorage.setItem("isRedirected", "false");
            if(optionLogin != null ){
              const perfil = JSON.parse(optionLogin);
            this.negocioRuta(perfil.url);
          } else {
              this.router.navigate(["/tabs/inicio"]);
            // this.location.assign("/tabs/inicio");
          }
          this.notificacion.exito(respuesta.message);
          this.loader = false;
        }
        if (respuesta.code === 402) {
          this.loader = false;
          this.notificacion.alerta("Usuario y/o contraseña incorrectos");
        }
      },
      (error) => {
        this.loader = false;
        this.notificacion.error(error);
      }
    );
  }

  /**
   * validationfg
   */
  public validationfg(inform, forg) {
    const resConfirmed = inform;
    if (
      typeof resConfirmed.user.providerData[0].uid === "undefined" ||
      resConfirmed.user.providerData[0].uid === null ||
      resConfirmed.user.providerData[0].uid === "undefined"
    ) {
      switch (forg) {
        case 1:
          this.loader = false;
          this.notificacion.error(
            "Se perdio la conexión con el servicio de Facebook, Reintentar"
          );
          break;
        case 2:
          this.loader = false;
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

        if (response.data.code === 200) {
          this.usuario.password = this.passFace;
          this.usuario.usuario = data.email;

          this.doLogin();
        } else {
          this.loader = false;
          this.notificacion.alerta(response.data.message);
        }
      },
      (error) => {
        this.loader = false;
        this.notificacion.alerta(error);
      }
    );

  }
  google(datosGoogle) {
    const resConfirmed = datosGoogle;
    const user = resConfirmed.user;

    this.passGogl = user.providerData[0].uid;
    let data = {
      firstName: user.providerData[0].displayName,
      email: user.providerData[0].email,
      photoUrl: user.providerData[0].photoURL,
      id: user.providerData[0].uid,
    };
    this.usuarioSistema.crearCuantaAdminGoogle(data).subscribe(
      (response) => {

        if (response.data.code === 200) {

          this.usuario.password = this.passGogl;
          this.usuario.usuario = data.email;

          this.doLogin();
        } else {
          this.loader = false;
          this.notificacion.alerta(response.data.message);
        }
      },
      (error) => {
        this.loader = false;
        this.notificacion.alerta(error);
      }
    );
  }
  public obtenerCorreo(evento: any) {
    if ((evento !== '' || evento !== undefined) && evento.length >= 1) {
      this.blnTelefono = false;
      this.medio = 2;
    } else {
      this.blnTelefono = true;
    }
  }
  public obtenerNumeroCelular(evento: any) {
    if ((evento !== '' || evento !== undefined) && evento.length === 10) {
      this.blnCorreo = false;
      this.medio = 1;
    } else {
      this.blnCorreo = true;
    }
  }

  negocioRuta(negocioURL) {
    this.router.navigate(["/tabs/inicio"], { queryParams: { byLogin: negocioURL } });
  }
}
