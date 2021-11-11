import { OptionBackLogin } from '../../Modelos/OptionBackLoginModel';
import { Component, OnInit } from "@angular/core";
import { Login } from "../../Modelos/login";
import { LoginService } from "../../api/login.service";
import { AppSettings } from "../../AppSettings";
import { Location } from "@angular/common";
import { SessionUtil } from "../../utils/sessionUtil";
import { SideBarService } from "../../api/busqueda/side-bar-service";
import { ModalController, Platform } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { ToadNotificacionService } from "../../api/toad-notificacion.service";
import { RecuperarContraseniaPage } from "./recuperar-contrasenia/recuperar-contrasenia.page";
import { Subscription } from "rxjs";
import { ResponderLogin } from "../../Modelos/ResponderLogin";
import { OneSignalNotificationsService } from "../../api/one-signal-notifications.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.page.html",
    styleUrls: ["./login.page.scss"],
    providers: [SessionUtil],
})
export class LoginPage implements OnInit {
    public usuario: Login;
    public loader: boolean;
    private backButtonPhysical: Subscription;
    public returnToLocation: OptionBackLogin;
    public textInitSession: string;
    public whatPlatformIs: boolean = false;

    constructor(
        private loginService: LoginService,
        private location: Location,
        private sessionUtil: SessionUtil,
        private sideBarService: SideBarService,
        private notification: ToadNotificacionService,
        private activeRoute: ActivatedRoute,
        private platform: Platform,
        private route: Router,
        private modalController: ModalController,
        private signal: OneSignalNotificationsService
    ) {
        this.whatPlatformIs = this.platform.is('ios');
        this.loader = false;
        this.usuario = new Login(null, null);
        this.ionViewDidEnter();
        this.ionViewWillLeave();
        this.textInitSession = 'Iniciando sesión';
    }

    ngOnInit(): void {
        if (localStorage.getItem("isRedirected") === "false" && !this.whatPlatformIs) {
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

    ionViewDidEnter() {
        this.backButtonPhysical = this.platform.backButton.subscribe(() => {
            this.backPhysicalBottom();
        });
    }


    ionViewWillLeave() {
        this.backButtonPhysical.unsubscribe();
    }


    public responseOptions(response: ResponderLogin) {
        this.loader = true;
        const credentials = response.body;
        switch (response.responder) {
            case 'error':
                this.loader = false;
                this.notification.error(response.notification);
                break;
            case 'success':
                if (response.isAppleID) {
                    const userCredentials = new Login(credentials.user, credentials.email, 'apple');
                    console.log(JSON.stringify(userCredentials));
                    this.login(userCredentials);
                } else {
                    if (typeof credentials.user.providerData[0].uid === "undefined" || credentials.user.providerData[0].uid == null) {
                        this.loader = false;
                        this.notification.error('Error en la comunicación, datos corruptos');
                    } else {
                        const userCredentials = new Login(credentials.user.providerData[0].uid, credentials.user.email);
                        this.login(userCredentials);
                    }
                }
                break;
        }
    }

    public loginCommon() {
        this.loader = true;
        const userCommonCredentials = new Login(this.usuario.password, this.usuario.usuario);
        this.login(userCommonCredentials);

    }

    private login(user: Login) {
        this.loginService.login(user).subscribe(
            (response) => {
                if (response.code === 200) {
                    AppSettings.setTokenUser(response);
                    this.sideBarService.publishSomeData("");
                    localStorage.setItem("isRedirected", "false");
                    const optionEnterLogin = localStorage.getItem('optionLogin');
                    this.signal.setUserExternal();
                    if (optionEnterLogin != null) {
                        this.returnToLocation = JSON.parse(String(optionEnterLogin));
                        this.goToRoute(this.returnToLocation.url);
                    } else {
                        window.location.assign("/tabs/inicio");
                    }
                    this.notification.exito(response.message);
                    this.loader = (this.whatPlatformIs);
                }
                if (response.code === 402) {
                    this.loader = false;
                    this.notification.alerta("Usuario y/o contraseña incorrectos");
                }
            }, (error) => {
                this.loader = false;
                this.notification.error(error);
            }
        );
        console.log(this.loader);
    }

    private goToRoute(url) {
        this.route.navigate(["/tabs/inicio"], { queryParams: { byLogin: url } });
    }

    async recoverPassword() {
        const modal = await this.modalController.create({
            component: RecuperarContraseniaPage,
        });
        await modal.present();
    }

    public toRegister() {
        this.route.navigate(["/tabs/registro-persona"]);
    }

    public backPhysicalBottom() {
        const optionEnterLogin = localStorage.getItem('optionLogin');
        this.returnToLocation = JSON.parse(String(optionEnterLogin));
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
    }
}
