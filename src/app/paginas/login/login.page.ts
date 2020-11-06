import {Component, OnInit} from '@angular/core';
import {Login} from "../../Modelos/login";
import {LoginService} from "../../api/login.service";
import {AppSettings} from "../../AppSettings";
import {Location} from '@angular/common';
import {SessionUtil} from "../../utils/sessionUtil";
import {SideBarService} from "../../api/busqueda/side-bar-service";
import {NavController} from "@ionic/angular";
import {Capacitor, Plugins, registerWebPlugin} from "@capacitor/core";
import {NavigationExtras, Router} from "@angular/router";
import {FacebookLogin} from "@rdlabo/capacitor-facebook-login";
import {GooglePlus} from "@ionic-native/google-plus/ngx";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Platform } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AlertController } from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    providers: [
        SessionUtil
    ]
})
export class LoginPage implements OnInit {

    public usuario: Login;
    public loader: boolean;
    public user:any;
    public logininfo:any;
    userData: any = {};

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
        private router: Router,
        private googlePlus: GooglePlus,
        private afAuth: AngularFireAuth,
        private platform: Platform,
        private fb: Facebook,
        public alertController: AlertController
    ) {
        this.loader = false;
        this.usuario = new Login();
        registerWebPlugin(FacebookLogin);
    }

    ngOnInit(): void {
    }

    doLogin() {
        this.loader = true;
        if(this.usuario.usuario !== null && this.usuario.password !== null){
            this.loginService.login(this.usuario).subscribe(
                respuesta => {
                    console.log(respuesta);
                    if(respuesta.code === 200){
                        const actualizado = AppSettings.setTokenUser(respuesta);
                        // this.sideBarService.actualizarSide();
                        // this.loader = false;
                        this.sideBarService.publishSomeData('');
                        this.navctrl.back()
                    }else{
                        this.presentAlert();
                    }
                },
                    error => {
                }
            );
        }
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
        const res = await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        const user = res.user;
        console.log('Datos de usuario Google:', user.providerData);
        this.picture = user.photoURL;
        this.name = user.displayName;
        this.email = user.email;
        this.uid = user.uid;
        this.usuario.password = user.providerData[0].uid;
        this.usuario.usuario = this.email;
        this.doLogin();
    }

    /**
     * Login Android
     */
    async loginGoogleAndroid() {
        const res = await this.googlePlus.login({
            'webClientId':'923911532405-77uvn5rfg78cc0f1bis1lve31bahu3jc.apps.googleusercontent.com' ,
            'offline': true
        });
        const resConfirmed = await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
        const user = resConfirmed.user;
        this.picture = user.photoURL;
        this.name = user.displayName;
        this.email = user.email;
        this.uid = user.uid;
        this.usuario.password = user.providerData[0].uid;
        this.usuario.usuario = this.email;
        this.doLogin();
    }

    /**
     * Movil o web
     */
    loginGoogle() {
        if (this.platform.is('android')) {
            this.loginGoogleAndroid();
        } else {
            this.loginGoogleWeb();
        }
    }

    /**
     * Login Web
     */
    async loginFacebookWeb() {

        const res = await this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
        const user = res.user;
        console.log('Datos de usuario Facebook:', user);
        this.picture = user.photoURL;
        this.name = user.displayName;
        this.email = user.email;
        this.uid = user.uid;
        this.usuario.password = user.providerData[0].uid;
        this.usuario.usuario = this.email;
        this.doLogin();

    }

    /**
     * Login Android
     */
    async loginFacebookAndroid() {
        const res: FacebookLoginResponse = await this.fb.login(['public_profile', 'email']);
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        const resConfirmed = await this.afAuth.auth.signInWithCredential(facebookCredential);
        const user = resConfirmed.user;
        this.picture = user.photoURL;
        this.name = user.displayName;
        this.email = user.email;
        this.usuario.password = user.providerData[0].uid;
        this.usuario.usuario = this.email;
        this.doLogin();

    }

    /**
     * Movil o web
     */
    loginFacebook() {
        if (this.platform.is('capacitor')) {
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
            cssClass: 'my-custom-class',
            header: 'Aviso',
            subHeader: '',
            message: 'Datos incorrectos, verifique sus credenciales',
            buttons: ['OK']
        });

        await alert.present();
    }

}
